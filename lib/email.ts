export interface OrderItemEmailData {
  product_name_ar: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderEmailData {
  order_number: string;
  customer_name: string;
  phone: string;
  total: number;
  payment_method: string;
  email?: string;
  items: OrderItemEmailData[];
}

export async function sendOrderConfirmation(order: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@herustore.com';
    const toEmail = order.email || process.env.ADMIN_EMAIL || fromEmail; // Send to customer if exists, else notify admin

    if (!apiKey) {
      // Fail silently if key is not configured, making email optional
      return { success: false };
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name_ar}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: left;">${item.total} ج.م</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h1 style="color: #7c3aed; margin-top: 0; text-align: center;">تأكيد طلبك من متجر Heru</h1>
          <p style="font-size: 16px;">مرحباً <strong>${order.customer_name}</strong>،</p>
          <p style="font-size: 16px; line-height: 1.5;">شكراً لتسوقك معنا! لقد استلمنا طلبك بنجاح وهو قيد المعالجة.</p>
          
          <div style="background-color: #f0ebff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; text-align: center; color: #5b21b6;">
              <strong>رقم الطلب:</strong> #${order.order_number}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">المنتج</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">الكمية</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold;">الإجمالي الكلي:</td>
                <td style="padding: 15px 10px; text-align: left; font-weight: bold; color: #7c3aed;">${order.total} ج.م</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>طريقة الدفع:</strong> ${order.payment_method === 'cash' ? 'الدفع عند الاستلام' : order.payment_method}</p>
            <p style="margin: 5px 0;"><strong>رقم الهاتف المرفق:</strong> ${order.phone}</p>
          </div>

          <div style="background-color: #e6fcf5; border-right: 4px solid #20c997; padding: 15px; margin-top: 25px;">
            <p style="margin: 0; color: #0ca678; font-size: 16px; font-weight: bold;">
              سيتواصل معك فريقنا قريباً عبر WhatsApp لتأكيد الشحن وتسليم الطلب.
            </p>
          </div>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #888; font-size: 14px;">
          مع تحيات فريق عمل متجر Heru
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `Heru Store <${fromEmail}>`,
        to: [toEmail],
        subject: `تأكيد الطلب #${order.order_number}`,
        html: htmlContent
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend API Error:', errorData);
      return { success: false, error: 'Failed to send email via Resend' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Email sending failed exception:', error);
    return { success: false, error: 'Internal error during email sending phase' };
  }
}
