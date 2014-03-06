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

![Runing Bit-Shadow Press](http://foldi.github.io/Bit-Shadow-Press/images/bsp-screen001.jpg "Bit-Shadow Press")

The default options should work fine. However, you can adjust them to update the following details.

* OriginX - The 2D horizontal origin of your artwork. Usually this is the left edge.
* OriginY - The 2D vertical origin of your artwork. Usually this is the top edge.
* Resolution - If you create pixel art that uses 8px X 8px units, set this to 1:8. There are options for 2, 4, 8, 16 and 32 pixel dimensions.
* RGB - If your artwork includes transparency, this color will show through the transparency.

Upload your files via the "Choose files" button. You should see something like this.

![Uploading files](http://foldi.github.io/Bit-Shadow-Press/images/bsp-screen002.jpg "Bit-Shadow Press")




