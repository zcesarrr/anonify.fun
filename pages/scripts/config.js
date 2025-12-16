const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.includes('192.168.');

const config = {
    baseURL: isLocalhost ? "http://localhost:3000/" : "https://anonify-api.up.railway.app/"
}