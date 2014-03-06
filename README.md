Bit-Shadow Press
======

Bit-Shadow Press is a utility that analyzes a sequence of bitmaps and outputs json formatted data for use by [Bit-Shadow Machine](https://github.com/foldi/Bit-Shadow-Machine). You can use it to create traditional frame-based animation in a web browser.

## How to use

First, create a pixel art animation using whatever tool you feel comfortable with. For best results, follow these guidelines.

* All frames should be the same size.
* Save your files in either .jpg or .png format.
* You can include transparency in .png 24-bit format.

If you don't have your own files, use the image sequence in the [/public/example-frames](https://github.com/foldi/Bit-Shadow-Press/tree/master/public/example-frames) folder.

Second, clone this repo, run npm install and run the app.

```html
git clone https://github.com/foldi/Bit-Shadow-Press.git
cd Bit-Shadow-Press
npm install
node app
```

The utility uses the HTML 5 Filesystem API which means you need run it in [Google Chrome](http://www.google.com/chrome/).

Open Chrome and point it to http://localhost:8080/
