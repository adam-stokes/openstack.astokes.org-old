# Multi Installer Guide

## Pre-requisites

Multi-Installer has been tested on Ubuntu Server, which is the recommended OS for the cloud installer.

Add the OpenStack installer ppa to your system.

```
$ sudo apt-add-repository ppa:cloud-installer/stable
$ sudo apt-get update
```

> Adding the ppa is only necessary until an official release to the archives has been announced.

> For a proper installation the system must have an available network interface
> that can be managed by MAAS and respond to DNS/DHCP requests. The private
> network can then be configured to forward traffic out via public network
> interface.

An example of a system with 2 network interfaces **eth0 (public)** and **eth1 (private, bridged)**

```
# The loopback network interface
auto lo
iface lo inet loopback
  dns-nameservers 127.0.0.1
  pre-up iptables-restore < /etc/network/iptables.rules

auto eth0
iface eth0 inet dhcp

auto eth1
iface eth1 inet manual

auto br0
iface br0 inet static
  address 172.16.0.1
  netmask 255.255.255.0
  bridge_ports eth1
```

Below sets up the NAT for those interfaces, save to **/etc/network/iptables.rules**:

> Make sure the **bridge-utils** package is installed.

```
*nat
:PREROUTING ACCEPT [0:0]
:INPUT ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
:POSTROUTING ACCEPT [0:0]
-A POSTROUTING -s 172.16.0.1/24 ! -d 172.16.0.1/24 -j MASQUERADE
COMMIT
```

Finally, enable IP Forwarding:

```
$ echo 1 > /proc/sys/net/ipv4/ip_forward
```

> To make IP Forwarding persists, set the value in **/etc/sysctl.conf**

## Installation

Install OpenStack installer via apt-get

```
$ sudo apt-get install openstack
```

## Start the installation

To start the installation run the following command

```
$ sudo openstack-install --edit-placement
```

> The installer should be run with sudo.

An initial dialog box will appear asking you to select which type of install, choose **Multi-system**.

Fill in the subsequent dialogs for setting your password, entering the MAAS IP and API Key.

Once juju is bootstrapped the installer will present a placement screen which
allows the user to place services on specific machines. The placement screen
does a few checks so that services will not be placed in a container that will
only work in a KVM.

There is a minimal requirement for **Neutron** that requires **2 NICs** and that
machine should be selected during placement.

> After a complete deploy it is necessary to tell **Neutron** which interface to use for external network access.
>
> ```
> $ JUJU_HOME=~/.cloud-install/juju juju set neutron-gateway ext-port=<interface>
> ```
>
> Or define the option in a separate **charm-config.yaml** file:
>
> ```
>  neutron-gateway:
>    ext-port: <interface>
> ```
>
> Then before you run the install append this option:
>
> ```
> $ sudo openstack-install --charm-config /path/to/charm-config.yaml
> ```
>
> This will merge in the custom charm options with the rest of the configuration
> as to not lose any default setup options.

### Configuring Neutron

**TODO: Update documentation**

In the meantime have a look at Robert Clark's [additional steps](https://github.com/Ubuntu-Solutions-Engineering/openstack-installer/issues/616#issue-85544487)

## Setting a password

When asked to set the openstack password it should be noted that this password
is used throughout all openstack related services (ie Horizon login password).

## Next Steps

The installer will run through a series of steps starting with making sure the
necessary bits are available for a multi system installation and ending with a
juju bootstrapped system.

## Accessing the OpenStack environment

See Using Juju in OpenStack Guide \<using-juju-in-openstack.guide\>

## Tips

Juju will arbitrarily pick a machine to install its state server to, however, if
a machine exists that is better suited you can tell the OpenStack installer to
use that machine instead:

```
$ JUJU_BOOTSTRAP_TO=openstack-vm-bootstrap.maas sudo -E openstack-install
```

> **note**
>
> **sudo -E** is necessary for the current environment to be preserved.
>
> A common scenario is to use a virtual machine as the juju bootstrap node as to
> not waste a bare metal machine in the MAAS cluster. Visit the link on
> [uvtool](https://help.ubuntu.com/lts/serverguide/cloud-images-and-uvtool.html)
> for more information on creating virtual machines.

## Troubleshooting

The installer keeps its own logs in **$HOME/.cloud-install/commands.log**.

## Uninstalling

To uninstall and cleanup your system run the following

```
$ sudo openstack-install -u
```
