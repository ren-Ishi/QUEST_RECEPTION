require('dotenv').config();
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // HTTPメソッドがPOST以外の場合は405を返す
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  // 環境変数が設定されていない場合は500エラーを返す
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!DISCORD_WEBHOOK_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Discord Webhook URL is not defined' })
    };
  }

  try {
    // Discordに通知を送信
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: '新しいクエストが登録されました！冒険者の皆さん、ボードをご確認くださいませ。'
      })
    });

    // Discord APIがエラーを返した場合は詳細なエラーメッセージを表示
    if (!response.ok) {
      const errorBody = await response.text();  // Discord APIからのレスポンスを取得
      throw new Error(`Discord API error: ${errorBody}`);
    }

    // 通知送信成功
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをコンソールに出力
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send notification', error: error.message })
    };
  }
};
