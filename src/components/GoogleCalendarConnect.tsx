import { useState, useEffect } from 'react'
import { Calendar, Link2Off } from 'lucide-react'

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'

interface GoogleEvent {
  start: { dateTime: string }
  end: { dateTime: string }
}

const GoogleCalendarConnect = () => {
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      window.gapi.load('client:auth2', initClient)
    }
    document.body.appendChild(script)
  }, [])

  const initClient = () => {
    window.gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    }).then(() => {
      // Check if already signed in
      if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        setIsConnected(true)
        saveToken()
      }

      // Listen for sign-in state changes
      window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
        setIsConnected(isSignedIn)
        if (isSignedIn) saveToken()
      })
    })
  }

  const saveToken = async () => {
    const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
    localStorage.setItem('googleCalendarToken', token)
  }

  const handleConnect = () => {
    window.gapi.auth2.getAuthInstance().signIn()
  }

  const handleDisconnect = () => {
    window.gapi.auth2.getAuthInstance().signOut()
    localStorage.removeItem('googleCalendarToken')
    setIsConnected(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Google Calendar Integration</h3>
      {isConnected ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <Calendar size={20} />
            <span>Connected to Google Calendar</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Link2Off size={20} />
            <span>Disconnect</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Calendar size={20} />
          <span>Connect Google Calendar</span>
        </button>
      )}
    </div>
  )
}

export default GoogleCalendarConnect
