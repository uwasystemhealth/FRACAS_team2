# better-fracas backend

## Adding new packages

When installing a new package to the project, please check compatibility with the following command:

```bash
licensecheck -u requirements --ignore-packages pytest-ruff big-O sqlcipher3-binary zope.interface | grep ✖  # all compatible with gnu gpl 3.0. pytest-ruff=MIT, big-O=BSD, sqlcipher3-binary=ZLIB, zope.interface=ZOPE
```

Currently, `mysql-connector-python` and `mysqlclient` are failing due to a bug for optional dependencies. See https://github.com/FHPythonUtils/LicenseCheck/issues/52.
