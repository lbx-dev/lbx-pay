#!/bin/bash

TYPE=${BASH_ARGV[0]}
FOLDER=${BASH_ARGV[1]};

case "$TYPE" in
    "--mount" | "-m")
        if grep -qs ${FOLDER} /proc/mounts; then
            echo "Foler is already mounted."
        else
            echo "Mounting...";
            mount -t tmpfs tmpfs ${FOLDER};
            echo "Mounted.";
        fi
        ;;
    "--umount" | "-unmount" | "-u")
        if grep -qs ${FOLDER} /proc/mounts; then
            echo "Unmounting...."
            umount ${FOLDER};
            echo "Unmounted...";
        else
            echo "Folder is not mounted. Nothing to unmount";
        fi
        ;;
    *)
        echo "Error..."
        ;;
esac