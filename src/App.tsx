import './index.css'
import Calendar from './components/calendar'

function App() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Date Picker Feature Rebuild</h1>
        <p className="text-gray-500 mt-2">Pull Request 1: Core UI & Calendar Grid</p>
      </div>
      <Calendar />
    </main>
  );
}

export default App;