module.exports = (MARSModules) => {
with (MARSModules) {
let id = param("id");
if(!id) {
  response.status(422);
  write('msg', 'No id provided.');
  exit();
}
let image = db.query("SELECT img_title, img_image FROM images WHERE img_id=?", id);
let brojRedova = image.rows;
if (image.rows == 0 || image[0].img_image == null) {
  //response.status(400);
  write('msg', 'Not found');
}

let mimeType = image[0].fileContentType;
header("Content-Type", mimeType);
header("Content-Disposition", 'inline; filename="' + image[0].img_title + '"');
write(image[0].img_image);
}
}