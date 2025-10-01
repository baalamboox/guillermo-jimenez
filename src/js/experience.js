const gjExperienceCanvas = document.querySelector("#experienceCanvas");

gjExperienceCanvas.width = 1220;
gjExperienceCanvas.height = 1000;

if(gjExperienceCanvas.getContext) {
    const ctx = gjExperienceCanvas.getContext("2d");

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.moveTo(550, 550);
    ctx.quadraticCurveTo(550, 150, 10, 10);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.moveTo(550, 550);
    ctx.lineTo(550, 550);
    ctx.lineTo(1050, 350);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.moveTo(550, 550);
    ctx.lineTo(550, 550);
    ctx.lineTo(150, 350);
    ctx.closePath();
    ctx.stroke();

    // Circles

    ctx.beginPath();
    ctx.fillStyle = "rgba(176, 134, 255, 1)";
    ctx.arc(550, 550, 100, 0, 180, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 134, 255, 1)";
    ctx.arc(1050, 350, 150, 0, 180, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(238, 121, 121, 1)";
    ctx.arc(550, 150, 50, 0, 180, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(121, 238, 150, 1)";
    ctx.arc(150, 350, 120, 0, 180, false);
    ctx.fill();

    
}
