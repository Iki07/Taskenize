export async function generateRandomAvatar() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Postavljanje dimenzija avatara
    canvas.width = 100;
    canvas.height = 100;

    // Kreiranje gradijenta
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, randomColor()); 
    gradient.addColorStop(1, randomColor()); 

    // Iscrtavanje kruga sa gradijentom
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Konvertovanje u Blob
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/png');
    });
}

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



//primena je ilustrovana u TestView


 