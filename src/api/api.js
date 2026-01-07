const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async shorten(longUrl, customAlias) {
    const res = await fetch(`${BASE_URL}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        longUrl, 
        customAlias: customAlias || undefined 
      }),
    });
    return res.json();
  },

  async getUrls(apiKey) {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: { 'x-api-key': apiKey },
    });
    return res.json();
  },

  async deleteUrl(id, apiKey) {
    const res = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apiKey },
    });
    return res.json();
  },
  
  async updateUrl(id, longUrl, shortCode, apiKey) {
    const res = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey 
      },
      body: JSON.stringify({ longUrl, shortCode }),
    });
    return res.json();
  }
};