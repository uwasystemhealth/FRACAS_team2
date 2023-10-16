# better-fracas backend

## Getting started

<!-- ```
./quickstart.sh

# Optionally run `flask db init` and make an initial migration after this if migrations are not present.
``` -->

## Adding new packages

When installing a new package to the project, please check compatibility with the following command:

```bash
licensecheck -u requirements --ignore-packages pytest-ruff big-O sqlcipher3-binary zope.interface | grep ✖  # all compatible with gnu gpl 3.0. pytest-ruff=MIT, big-O=BSD, sqlcipher3-binary=ZLIB, zope.interface=ZOPE
```

Currently, `mysql-connector-python` and `mysqlclient` are failing due to a bug for optional dependencies. See https://github.com/FHPythonUtils/LicenseCheck/issues/52.

## Migrating database

When migrating READ THE ERRORS (I should take my own advice) before deleting. Revert the migration and try again if it goes wrong.

```bash
flask db stamp head
flask db migrate -m "description of changes"
flask db upgrade # applies changes
```
