FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelWidth: '150px',
    stylePanelHeight: '100px',
    stylePanelAspectRatio: 100/150,
    imageResizeTargetWidth: [100, 200, 450], // Add the sizes you want
    imageResizeTargetHeight: [150, 300, 300] // Add corresponding heights
  })
  FilePond.parse(document.body);