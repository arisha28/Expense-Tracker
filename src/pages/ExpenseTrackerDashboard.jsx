import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function ExpenseTrackerDashboard() {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newExpense = {
            id: Date.now(),
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: formData.date
        };
        
        setExpenses([...expenses, newExpense]);
        setFormData({ description: '', amount: '', category: '', date: '' });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className='pt-3'>Interactive Expense Tracker</h2>
                </Col>
            </Row>
            <Row>
                <Col md={5}>
                    <Form className='border p-4' style={{ backgroundColor: '#F4F5F7' }} onSubmit={handleSubmit}>
                        <h4>Add Expense</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type='text' 
                                name='description' 
                                placeholder='e.g., Weekly Groceries' 
                                required 
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control 
                                type='number' 
                                name='amount' 
                                placeholder='e.g., 45.50' 
                                required 
                                value={formData.amount} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select 
                                required 
                                name='category' 
                                value={formData.category} 
                                onChange={handleChange}
                            >
                                <option value="">---Select Category---</option>
                                <option value="Food">Food</option>
                                <option value="Housing">Housing</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control 
                                type='date' 
                                name='date' 
                                required 
                                value={formData.date} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                        <Button type='submit' size='lg' style={{ backgroundColor: 'blue' }} className='mt-3 w-100'> 
                            Add Expense 
                        </Button>
                    </Form>
                </Col>
                <Col md={7}>
                    <Row>
                        <Col>
                            <Card className='border p-4 shadow' style={{ backgroundColor: '#F4F5F7' }}>
                                <h4>Total Spend</h4>
                                <h2>1,248.50</h2>
                            </Card>             
                        </Col>  
                        <Col>
                            <Card className='border p-4 shadow' style={{ backgroundColor: '#F4F5F7' }}>
                                <h4>Trans. Count</h4>
                                <h2>12 items</h2>
                            </Card> 
                        </Col> 
                        <Col>
                            <Card className='border p-4 shadow' style={{ backgroundColor: '#F4F5F7' }}>
                                <h4>Top Category</h4>
                                <h2>Food</h2>
                            </Card>
                        </Col>
                    </Row>  
                    <Col className='border p-4 mt-3' style={{ backgroundColor: '#F4F5F7' }}>
                        <a href="#" className='border text-decoration-none p-1 m-1 rounded d-inline-block' style={{ backgroundColor: 'pink' }}>All</a>
                        <a href="#" className='border text-decoration-none p-1 m-1 rounded d-inline-block'>Food</a>
                        <a href="#" className='border text-decoration-none p-1 m-1 rounded d-inline-block'>Housing</a>
                        <a href="#" className='border text-decoration-none p-1 m-1 rounded d-inline-block'>Entertainment</a>
                        <a href="#" className='border text-decoration-none p-1 m-1 rounded d-inline-block'>Other</a>
                    </Col>    
                    <div>
                        <h4>Expense History</h4>
                        {expenses.length === 0 ? (
                            <p>No expense added yet. Fill out form to get started!</p>
                        ) : (
                            expenses.map((expense) => (
                                <div key={expense.id} className="border p-3 mb-2 bg-white rounded shadow-sm d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{expense.description}</h5>
                                        <small>
                                            {expense.date} | <span>{expense.category}</span>
                                        </small>
                                    </div>
                                    <div>
                                        <h5>-${expense.amount.toFixed(2)}</h5>
                                    </div>
                                </div>
                            ))
                        )}
                        </div>        
                </Col>
            </Row>
        </Container>
    );
}

export default ExpenseTrackerDashboard;