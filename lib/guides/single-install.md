# Single Installer Guide

## Pre-requisites

Add the OpenStack installer ppa to your system.

```
$ sudo apt-add-repository ppa:cloud-installer/stable
$ sudo apt-get update
```

> **note**
>
> Adding the ppa is only necessary until an official release to the archives has
> been announced.

## Recommended Hardware

The installer would work best with at least:

- 12G RAM
- 100G HDD (SSD for optimal performance)
- 8 CPUS

## Installation

Install the OpenStack installer via apt-get

```
$ sudo apt-get install openstack
```

## Start the installation

To start the installation run the following command

```
$ sudo openstack-install
```

> **important**
>
> The installer should be run with sudo.

Optional Flags

```
usage: openstack-install [-h] [-i] [-u] [-c CONFIG_FILE]
                         [--charm-config CHARM_CONFIG_FILE] [-g GET_CONFIG]
                         [-k] [--killcloud-noprompt]
                         [--openstack-release OPENSTACK_RELEASE] [-a ARCH]
                         [-r RELEASE] [-p]
                         [--upstream-ppa]
                         [--upstream-deb UPSTREAM_DEB]
                         [--http-proxy HTTP_PROXY] [--https-proxy HTTPS_PROXY]
                         [--headless] [--storage {ceph,swift}] [--version]

Ubuntu Openstack Installer

optional arguments:
  -h, --help            show this help message and exit
  -i, --install-only    install and bootstrap MAAS/Juju/Landscape (as
                        applicable) only. Will not deploy any OpenStack
                        services in single or multi mode. You can invoke
                        openstack-status manually to continue.
  -u, --uninstall       Uninstalls the current cloud including removing of
                        packages.
  -c CONFIG_FILE, --config CONFIG_FILE
                        Custom configuration for OpenStack installer.
  --charm-config CHARM_CONFIG_FILE
                        Additional charm settings
  -g GET_CONFIG, --get-config GET_CONFIG
                        with arg <key>, prints config value for 'key' to
                        stdout and exits.
  -k, --killcloud       Tear down existing cloud leaving userdata in place.
                        Useful for iterative deploys.
  --killcloud-noprompt  Tear down existing cloud leaving userdata in place.
                        CAUTION: Does not confirm teardown, Use with care!
  --openstack-release OPENSTACK_RELEASE
                        Specify a specific OpenStack release by code-name,
                        e.g. 'icehouse' or 'juno'
  -a ARCH               <arch, ..> comma-separated list of architectures to
                        filter available cloud images with which to populate
                        Glance, e.g. amd64,arm64
  -r RELEASE            <rel, ..> comma-separated list of Ubuntu releases to
                        filter available cloud images with which to populate
                        Glance, e.g. precise,trusty
  -p, --placement       Show machine placement UI before deploying
  --upstream-ppa        Use experimental PPA.
  --upstream-deb UPSTREAM_DEB
                        Upload a local copy of openstack debian package to be
                        used in a single install. (DEVELOPERS)
  --http-proxy HTTP_PROXY
                        Specify HTTP proxy
  --https-proxy HTTPS_PROXY
                        Specify HTTPS proxy
  --headless            Run deployment without prompts/gui
  --storage {ceph,swift}
                        Choose storage backend to deploy initially.
  --version             show program's version number and exit
```

> **attention**
>
> Enabling swift storage requires at least 3 instances and another additional
> instance for swift-proxy. They are automatically deployed but stated here for
> reference.

An initial dialog box will appear asking you to select which type of install,
choose **Single system**.

## Setting a password

When asked to set the OpenStack password it should be noted that this password
is used throughout all OpenStack related services (ie Horizon login password).

## Installing of Services

The installer will run through a series of steps starting with making sure the
necessary bits are available for a single system installation and ending with a
juju bootstrapped system.

When the bootstrapping has finished it will immediately load the status screen.
From there you can see the nodes listed along with the deployed charms necessary
to start your private OpenStack cloud.

Adding additional compute nodes, block storage, object storage, and controllers
can be done by pressing A and making the selection on the dialog box.

Finally, once those nodes are displayed and the charms deployed the horizon
dashboard will be available to you for managing your OpenStack cloud.

## Logging into Horizon (Openstack Dashboard)

The login credentials for the dashboard are:

-   username: **ubuntu**
-   password: **"password that was set during installation"**

> **attention**
>
> If you are attempting to login to the dashboard from a machine other than the
> one used to perform the installation it may be required to add an iptables
> rule to enable port forwarding to your Horizon server.
>
> An example, if the openstack-dashboard service was deployed in this way:
>
> ```
> environment: local
> machines:
>   "1":
>     agent-state: started
>     agent-version: 1.20.11.1
>     dns-name: 10.0.4.84
>     instance-id: ubuntu-local-machine-1
>     series: trusty
>     containers:
>       1/lxc/7:
>         agent-state: started
>         agent-version: 1.20.11.1
>         dns-name: 10.0.4.159
>         instance-id: ubuntu-local-machine-1-lxc-7
>         series: trusty
>         hardware: arch=amd64
>     hardware: arch=amd64 cpu-cores=2 mem=6144M root-disk=20480M
> services:
>   openstack-dashboard:
>     charm: cs:trusty/openstack-dashboard-8
>     exposed: false
>     relations:
>       cluster:
>       - openstack-dashboard
>       identity-service:
>       - keystone
>     units:
>       openstack-dashboard/0:
>         agent-state: started
>         agent-version: 1.20.11.1
>         machine: 1/lxc/7
> ```
>
> Then an iptables rule to accessing the dashboard from port **9000** would look like this:
>
> ```
> $ sudo iptables -t nat -A PREROUTING -p tcp -d 192.168.0.98 --dport 9000 -j DNAT --to-destination 10.0.4.159:80
> ```
>
> Where **192.168.0.98** is the IP of the system the install was performed on
> and **10.0.4.159** is the public-address of the openstack-dashboard. The final
> URL should like like **<http://192.168.0.98:9000/horizon>** to bring up the
> OpenStack Dashboard.

## Accessing the OpenStack environment

[See Using Juju in OpenStack Guide](/guides/using-juju)

## Troubleshooting

The installer keeps its own logs in **$HOME/.cloud-install/commands.log**.

## Uninstalling

To uninstall and cleanup your system run the following

```
$ sudo openstack-install -u
```

## Advanced Usage

It is possible to stop and start the container housing OpenStack. To do so run
the following from the container host:

```
$ sudo lxc-stop -n openstack-single-$USER
$ sudo lxc-start -n openstack-single-$USER -d
$ sudo lxc-attach -n openstack-single-$USER
# now, inside the container:
% su ubuntu
% JUJU_HOME=~/.cloud-install/juju juju status
```

From this point on it is a matter of waiting for all services to be restarted
and shown as **agent-state: started** within the juju status output.

Once the services are started again, running the following from the host system
will bring up the status screen again:

```
$ openstack-status
```

> **caution**
>
> Depending on the host system, times vary when starting up all the services to
> when the cloud is accessible again. Most test runs of this have taken roughly
> 30 minutes to come back online.
>
> Disclaimer: As the single installer is provided as a demo or proof-of-concept,
> support for this advanced usage is very minimal.
