export async function generateEventDescription(eventDetails: {
  title: string;
  type: string;
  location: string;
}) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate a compelling description for an event titled "${eventDetails.title}" 
                of type "${eventDetails.type}" at "${eventDetails.location}". 
                Make it engaging and informative.`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating description:', error);
    return null;
  }
}