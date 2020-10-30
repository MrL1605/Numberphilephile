/**
 * Created By : Lalit Umbarkar
 * Created On : 11/10/20
 */

const Utl = (function () {

    const oliveColor = "#b5cc18", blackColor = "#1b1c1d", greyColor = "#767676", pickWidth = 10, pickHeight = 100;

    const rgbToHex = (r, g, b) => {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    return {
        blackColor, oliveColor, greyColor,
        pickWidth, pickHeight,
        getColorInd: (ctx, x, y) => {
            let imageData = ctx.getImageData(x, y, 1, 1).data;
            return "#" + ("000000" + rgbToHex(imageData[0], imageData[1], imageData[2])).slice(-6);
        },
        clearCanvas: (ctx) => {
            ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
            ctx.fillStyle = blackColor;
            ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        },
        drawVerticalToothpick: (ctx, cx, cy, color, latest = []) => {
            ctx.fillStyle = color;
            ctx.fillRect(cx, cy - (pickHeight / 2), pickWidth, pickHeight);
            latest.push([cx, cy]);
        },
        drawHorizontalToothpick: (ctx, cx, cy, color, latest = []) => {
            ctx.fillStyle = color;
            ctx.fillRect(cx - (pickHeight / 2), cy, pickHeight, pickWidth);
            latest.push([cx, cy]);
        }
    }
})();

const toothpick = (function () {

    let ctx, latestVertical = [], latestHorizontal = [];

    const addEdgeToothpicks = () => {

        let halfDiff = Utl.pickHeight / 2,
            upcomingVerticals = [], upcomingHorizontals = [];
        while (latestVertical.length) {
            let eachPick = latestVertical.pop(),
                ex = eachPick[0], ey = eachPick[1],
                abovePick = [ex, ey - halfDiff],
                belowPick = [ex, ey + halfDiff];
            Utl.drawVerticalToothpick(ctx, ...eachPick, Utl.greyColor);
            if (Utl.getColorInd(ctx, ex, ey - halfDiff - Utl.pickWidth) === Utl.blackColor)
                Utl.drawHorizontalToothpick(ctx, ...abovePick, Utl.oliveColor, upcomingHorizontals);
            if (Utl.getColorInd(ctx, ex, ey + halfDiff + Utl.pickWidth) === Utl.blackColor)
                Utl.drawHorizontalToothpick(ctx, ...belowPick, Utl.oliveColor, upcomingHorizontals);
        }
        while (latestHorizontal.length) {
            let eachPick = latestHorizontal.pop(),
                ex = eachPick[0], ey = eachPick[1],
                leftPick = [ex - halfDiff, ey],
                rightPick = [ex + halfDiff, ey];
            Utl.drawHorizontalToothpick(ctx, ...eachPick, Utl.greyColor);
            if (Utl.getColorInd(ctx, ex - halfDiff - Utl.pickWidth, ey) === Utl.blackColor)
                Utl.drawVerticalToothpick(ctx, ...leftPick, Utl.oliveColor, upcomingVerticals);
            if (Utl.getColorInd(ctx, ex + halfDiff + Utl.pickWidth, ey) === Utl.blackColor)
                Utl.drawVerticalToothpick(ctx, ...rightPick, Utl.oliveColor, upcomingVerticals);
        }
        latestHorizontal = upcomingHorizontals;
        latestVertical = upcomingVerticals;
    };

    const resetAndKeepOneToothpick = () => {
        if (!ctx) {
            console.error("Context not setup");
            return;
        }

        let canvasCenter = [ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2];
        latestVertical = [];
        latestHorizontal = [];
        Utl.clearCanvas(ctx);
        Utl.drawVerticalToothpick(ctx, ...canvasCenter, Utl.oliveColor, latestVertical);
    };

    const registerListeners = () => {
        document.getElementById("reset-grid").onclick = resetAndKeepOneToothpick;
        document.getElementById("next-trigger").onclick = addEdgeToothpicks;
    };

    return {
        init: () => {
            registerListeners();
            // let rootEle = document.getElementsByClassName("root-grid")[0];
            // rootEle.setAttribute("style", "height: " + rootEle.clientWidth + "px");
            const canvas = document.getElementById("root");
            let cH = canvas.parentElement.clientHeight, cW = canvas.parentElement.clientWidth,
                smallerDimension = cW > cH ? cW : cH;
            canvas.setAttribute("height", smallerDimension + "px");
            canvas.setAttribute("width", smallerDimension + "px");
            if (canvas.getContext)
                ctx = canvas.getContext('2d');
            resetAndKeepOneToothpick();
        },
    };

})();




