
 FilePond.registerPlugin(
    FilePondPluginImageResize,
    FilePondPluginImagePreview,

    );


FilePond.setOptions({
    stylePanelAspectRatio:150/100,
    imageResizeTargetWidth:100,
    imageResizeTargeHeight:150,
})

FilePond.parse(document.body)