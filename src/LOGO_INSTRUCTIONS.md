# How to Add the BUBT Logo

## Quick Steps:

1. **Create the images folder** (if it doesn't exist):
   ```
   mkdir images
   ```

2. **Save the BUBT logo image**:
   - Save the provided BUBT logo image as `bubt-logo.png`
   - Place it in the `/images/` folder
   - Final path should be: `/images/bubt-logo.png`

3. **The logo is already integrated** in all pages:
   - ✅ Home page header (16x16 size)
   - ✅ Home page hero (32x32 size with drop shadow)
   - ✅ Login page (20x20 size)
   - ✅ Register page (20x20 size)
   - ✅ User Dashboard header (12x12 size)
   - ✅ Admin Dashboard (Icon-based, can be replaced with logo)

## Alternative: Use Base64 Encoding

If you want to embed the logo directly in the code without a separate file:

1. Convert the BUBT logo to Base64:
   - Use an online tool like https://www.base64-image.de/
   - Upload your BUBT logo PNG
   - Copy the Base64 string

2. Replace all instances of `images/bubt-logo.png` in `app.js` and `dashboards.js` with:
   ```
   data:image/png;base64,YOUR_BASE64_STRING_HERE
   ```

## File Locations to Update:

The logo is referenced in these files:
- `/app.js` - Lines for Home, Login, and Register pages
- `/dashboards.js` - Line for User Dashboard header

## Current Logo References:

```html
<!-- Home page header -->
<img src="images/bubt-logo.png" alt="BUBT Logo" class="w-16 h-16 object-contain">

<!-- Home page hero -->
<img src="images/bubt-logo.png" alt="BUBT Logo" class="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-2xl">

<!-- Login page -->
<img src="images/bubt-logo.png" alt="BUBT Logo" class="w-20 h-20 object-contain mx-auto mb-4">

<!-- Register page -->
<img src="images/bubt-logo.png" alt="BUBT Logo" class="w-20 h-20 object-contain mx-auto mb-4">

<!-- User Dashboard -->
<img src="images/bubt-logo.png" alt="BUBT Logo" class="w-12 h-12 object-contain">
```

## Recommended Logo Specifications:

- **Format:** PNG with transparent background
- **Size:** 500x500 pixels or larger (will scale automatically)
- **Aspect Ratio:** 1:1 (square) works best
- **File Size:** Under 100KB for faster loading

## Testing:

After adding the logo, open `index.html` and verify:
1. Logo appears in top-left of home page
2. Large logo appears in hero section
3. Logo appears on login and register pages
4. Logo appears in user dashboard header

## Troubleshooting:

**Logo not showing?**
- Check that the file path is exactly `/images/bubt-logo.png`
- Check that the image file name is lowercase
- Check browser console for 404 errors
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

**Logo too big/small?**
- The Tailwind classes control size (w-16 h-16 = 64px x 64px)
- Adjust the classes in the HTML to change size
- Use `object-contain` to preserve aspect ratio

---

**The code is already updated and ready!** Just add your logo image file to `/images/bubt-logo.png` and it will work immediately.
