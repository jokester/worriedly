# worriedly

-----------------------------------

`worriedly` is a CLI tool set to preserve digital information (bytes) in non-electronic form (printed paper).

To make its user less worried, all the functionalities use no network connection.

## Create printable QR code from bytes

```
$ worriedly print-qr -i file -o qr.htm
```

## Extract bytes from printed QR code

This requires a WebRTC-capable browser.

```
$ worriedly scan-qr

(and do the rest in browser)
```

## Credits

This is but a small CLI wrapper around different libraries.

Thanks to the contributors of the libraries we used, for doing all the heavy lifting and sharing their work.

## License

WTFPL
