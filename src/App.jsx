import {BrowserRouter, Route , Routes} from 'react-router-dom'
import ExpenseTrackerDashboard from './pages/ExpenseTrackerDashboard'
function app() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ExpenseTrackerDashboard></ExpenseTrackerDashboard>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default app