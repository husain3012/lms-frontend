const loadCloudinaryWidget = (callback) => {
  const existingScript = document.getElementById("cloudinaryWidget");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.id = "cloudinaryWidget";
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

export default loadCloudinaryWidget;
