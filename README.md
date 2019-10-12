# worriedly

-----------------------------------

`worriedly` is a CLI tool set that helps worried people to preserve (or exchange) digital information in non-electronic form.

To make its user less worried, all the functionalities use no network connection.

## Print arbitrary bytes onto paper, as QR code

```
$ worriedly print-qr -i file -o qr.htm
```

## Extract bytes from QR code

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
