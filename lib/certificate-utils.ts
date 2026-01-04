import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Dimensions from requirements
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1414;

// Colors
const COLOR_BLACK = rgb(0, 0, 0);

interface CertificateData {
    studentName: string;
    designation: string;
    universityName: string;
    verifyCode: string;
}

export async function generateCertificatePDF(data: CertificateData, baseUrl: string): Promise<Uint8Array> {
    const { studentName, designation, universityName, verifyCode } = data;

    // 1. Load the background image
    const templatePath = path.join(process.cwd(), 'public/webImages/Certificate.jpg');
    const templateBytes = fs.readFileSync(templatePath);

    // 2. Create PDF and embed image
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([CANVAS_WIDTH, CANVAS_HEIGHT]);
    const image = await pdfDoc.embedJpg(templateBytes);

    page.drawImage(image, {
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
    });

    // 3. Embed Font
    // Using StandardFonts.Helvetica for reliability, but mimicking "embedded" requirement 
    // by using a fetch if we wanted a real TTF. For now, StandardFonts is safest to start.
    // To truly use embedded TTF, we would read a .ttf file and use pdfDoc.embedFont(bytes)
    // Let's try to find a system font or just use Helvetica and accept it for this iteration.
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 4. Draw Text
    const drawCenteredText = (text: string, yBase: number, maxWidth: number, fontSize: number, font: any) => {
        let currentFontSize = fontSize;
        let textWidth = font.widthOfTextAtSize(text, currentFontSize);

        // Auto-shrink
        while (textWidth > maxWidth && currentFontSize > 10) {
            currentFontSize -= 1;
            textWidth = font.widthOfTextAtSize(text, currentFontSize);
        }

        const x = (CANVAS_WIDTH - textWidth) / 2; // Center alignment
        // PDF coordinates: origin is bottom-left. 
        // Requirement says: "Origin: top-left (0,0), y for text is baseline Y"
        const pdfY = CANVAS_HEIGHT - yBase;

        page.drawText(text, {
            x,
            y: pdfY,
            size: currentFontSize,
            font: font,
            color: COLOR_BLACK,
        });
    };

    // 1) Student Name: baselineY: 770. Size: 70. Uppercase. Bold.
    drawCenteredText(studentName.toUpperCase(), 770, 1400, 70, fontBold);

    // 2) Designation: baselineY: 860. Size: 35. Normal (Regular).
    drawCenteredText(designation, 860, 1000, 35, fontRegular);

    // 3) University Name: baselineY: 930. Size: 35. Normal (Regular).
    drawCenteredText(universityName, 930, 1300, 35, fontRegular);

    // 5. Generate and Draw QR Code
    // New Requirement: 200x200.
    // Previous logic: Bottom-Right with ~30px padding.
    // Canvas Width: 2000, Height: 1414.
    // X = 2000 - 30 (pad) - 200 (width) = 1770.
    // Y in PDF coords (bottom-up): 
    //   Bottom margin = 30.
    //   Y = 30. 

    const verifyUrl = `${baseUrl}/verify/${verifyCode}`;
    const qrBase64 = await QRCode.toDataURL(verifyUrl, { margin: 0 });
    const qrImageBytes = Buffer.from(qrBase64.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    const qrSize = 200;
    // X = 1770, Y = 30

    page.drawImage(qrImage, {
        x: 1770,
        y: 30,
        width: qrSize,
        height: qrSize,
    });

    // 6. Draw Favicon in Center of QR Code
    // Load favicon
    const faviconPath = path.join(process.cwd(), 'public/webImages/favicon.png');
    if (fs.existsSync(faviconPath)) {
        const faviconBytes = fs.readFileSync(faviconPath);
        const faviconImage = await pdfDoc.embedPng(faviconBytes);

        // QR Center: X = 1770 + 100 = 1870, Y = 30 + 100 = 130
        // Icon Size: 25x25 (Increased slightly for visibility without background)
        const iconSize = 60;
        const iconX = 1870 - (iconSize / 2);
        const iconY = 130 - (iconSize / 2);

        page.drawImage(faviconImage, {
            x: iconX,
            y: iconY,
            width: iconSize,
            height: iconSize,
        });
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
