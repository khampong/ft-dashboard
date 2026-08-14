const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

export async function sendLineMessage(userId: string, message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!token) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN is not set. Skipping LINE message.');
    return;
  }

  try {
    const response = await fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send LINE message:', errorData);
    }
  } catch (error) {
    console.error('Error sending LINE message:', error);
  }
}

export async function sendMaintenanceAlert(
  customerName: string,
  forkliftCode: string,
  brand: string | null,
  model: string | null,
  hours: number,
  lineUserId: string
) {
  const brandModel = [brand, model].filter(Boolean).join(' ') || 'Forklift';
  const message = `🔔 แจ้งเตือนรอบซ่อมบำรุง ForkTech\n\nเรียนคุณ ${customerName}\n\nรถ Forklift รหัส: ${forkliftCode} (${brandModel})\nชั่วโมงการใช้งานปัจจุบัน: ${hours.toLocaleString()} ชม.\n\nถึงรอบเปลี่ยนถ่ายน้ำมันเครื่อง/ตรวจเช็คแล้วครับ กรุณาติดต่อเพื่อนัดหมายคิวช่างได้เลยครับ\n\nโทร: 08x-xxx-xxxx\nLine: @forktechgroup`;

  await sendLineMessage(lineUserId, message);
}
