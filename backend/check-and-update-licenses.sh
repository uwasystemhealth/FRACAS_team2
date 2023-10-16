licensecheck -u requirements --ignore-packages pytest-ruff big-O sqlcipher3-binary zope.interface | grep ✖  # all compatible with gnu gpl 3.0. pytest-ruff=MIT, big-O=BSD, sqlcipher3-binary=ZLIB, zope.interface=ZOPE

echo 'Currently, `mysql-connector-python` and `mysqlclient` are failing due to a bug for **optional** dependencies. See https://github.com/FHPythonUtils/LicenseCheck/issues/52.'

pip-licenses --format=plain-vertical --with-license-file --no-license-path > ../license/BACKEND-DEPENDENCIES-LICENSES.txt