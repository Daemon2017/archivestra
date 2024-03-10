#!/bin/sh
apt-get update
python3 -m pip install -r requirements.txt
python3 -m pip install ydb[yc]
