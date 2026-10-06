import { Container, Row, Col, Form, Button, Card, InputGroup, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';

// Helper for category styling and emojis
const CATEGORY_UI = {
    'Food': { emoji: '🍔', badgeBg: '#d1fae5', badgeText: '#059669', icon: '🛒' },
    'Housing': { emoji: '🏠', badgeBg: '#ffedd5', badgeText: '#ea580c', icon: '🏠' },
    'Utilities': { emoji: '⚡', badgeBg: '#e0e7ff', badgeText: '#4f46e5', icon: '💳' },
    'Entertainment': { emoji: '🎬', badgeBg: '#fce7f3', badgeText: '#db2777', icon: '🎟️' },
    'Transport': { emoji: '⛽', badgeBg: '#ffedd5', badgeText: '#ea580c', icon: '⛽' },
    'Other': { emoji: '📦', badgeBg: '#f3f4f6', badgeText: '#4b5563', icon: '📦' }
};

function ExpenseTrackerDashboard() {
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('trackerExpenses');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        description: '', amount: '', category: 'Food', date: ''
    });

    useEffect(() => {
        localStorage.setItem('trackerExpenses', JSON.stringify(expenses));
    }, [expenses]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
        setFormData({ description: '', amount: '', category: 'Food', date: '' });
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    // Math & Formatting
    const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = expenses.length;
    
    const categoryTotals = expenses.reduce((totals, exp) => {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
        return totals;
    }, {});
    
    let topCategoryName = "N/A";
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
        if (amount > topCategoryAmount) {
            topCategoryAmount = amount;
            topCategoryName = cat;
        }
    });

    // Filter & Search Logic
    let displayedExpenses = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
    if (searchQuery) {
        displayedExpenses = displayedExpenses.filter(e => 
            e.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Date Formatter (e.g., Oct 06, 2026)
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '3rem' }}>
            <Container className="pt-5">
                {/* HEADER */}
                <div className="d-flex align-items-center mb-4">
                    <h1 className="fw-bold mb-0 me-3" style={{ color: '#0F172A' }}>Interactive Expense Tracker</h1>
                    <Badge bg="light" text="primary" className="border text-primary px-3 py-2 rounded-pill shadow-sm">
                        Built with React + Bootstrap
                    </Badge>
                </div>

                <Row className="g-4">
                    {/* LEFT COLUMN: FORM */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-2">
                            <Card.Body>
                                <h4 className="fw-bold mb-4" style={{ color: '#0F172A' }}>Add Expense</h4>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted small fw-semibold mb-1">Description</Form.Label>
                                        <Form.Control type='text' name='description' placeholder='e.g., Weekly Groceries' required value={formData.description} onChange={handleChange} className="p-2 shadow-none border-secondary-subtle" />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted small fw-semibold mb-1">Amount</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-white border-secondary-subtle text-muted">$</InputGroup.Text>
                                            <Form.Control type='number' name='amount' placeholder='e.g., 45.50' required value={formData.amount} onChange={handleChange} className="p-2 shadow-none border-secondary-subtle border-start-0 ps-0" />
                                        </InputGroup>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted small fw-semibold mb-1">Category</Form.Label>
                                        <Form.Select required name='category' value={formData.category} onChange={handleChange} className="p-2 shadow-none border-secondary-subtle">
                                            {Object.keys(CATEGORY_UI).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-muted small fw-semibold mb-1">Date</Form.Label>
                                        <Form.Control type='date' name='date' required value={formData.date} onChange={handleChange} className="p-2 shadow-none border-secondary-subtle" />
                                    </Form.Group>
                                    
                                    <Button type='submit' className="w-100 fw-semibold p-2 mb-2 border-0 rounded-3" style={{ backgroundColor: '#4F46E5' }}> 
                                        Add Expense 
                                    </Button>
                                    
                                    <div className="text-warning small d-flex align-items-center">
                                        <span className="me-1">ⓘ</span> Warning or validate if empty
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* RIGHT COLUMN: DASHBOARD & LIST */}
                    <Col lg={8}>
                        {/* SUMMARY CARDS */}
                        <Row className="g-3 mb-4">
                            <Col md={4}>
                                <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                    <Card.Body>
                                        <div className="text-muted small fw-semibold mb-2">Total Spend</div>
                                        <h2 className="fw-bold mb-0" style={{ color: '#881337' }}>${totalSpend.toFixed(2)}</h2>
                                    </Card.Body>
                                </Card>             
                            </Col>  
                            <Col md={4}>
                                <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                    <Card.Body>
                                        <div className="text-muted small fw-semibold mb-2">Trans. Count</div>
                                        <h2 className="fw-bold text-secondary mb-0">{transactionCount} items</h2>
                                    </Card.Body>
                                </Card> 
                            </Col> 
                            <Col md={4}>
                                <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                    <Card.Body>
                                        <div className="text-muted small fw-semibold mb-2">Top Category</div>
                                        <h3 className="fw-bold mb-0" style={{ color: '#16A34A' }}>
                                            {topCategoryName} {topCategoryAmount > 0 && `($${topCategoryAmount.toFixed(2)})`}
                                        </h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>  

                        {/* CATEGORY FILTER & SEARCH ROW */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 p-2">
                            <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div className="d-flex flex-wrap gap-2">
                                    <Button 
                                        variant={filter === 'All' ? 'primary' : 'light'} 
                                        className={`rounded-pill px-3 py-1 border ${filter === 'All' ? 'border-primary' : 'border-secondary-subtle bg-white'}`}
                                        style={{ backgroundColor: filter === 'All' ? '#e0e7ff' : 'white', color: filter === 'All' ? '#4F46E5' : '#4b5563' }}
                                        onClick={() => setFilter('All')}
                                    >
                                        All
                                    </Button>
                                    {Object.entries(CATEGORY_UI).map(([cat, ui]) => (
                                        <Button 
                                            key={cat}
                                            variant="light"
                                            className={`rounded-pill px-3 py-1 border ${filter === cat ? 'border-primary' : 'border-secondary-subtle bg-white'}`}
                                            onClick={() => setFilter(cat)}
                                            style={{ color: '#4b5563', backgroundColor: filter === cat ? '#f3f4f6' : 'white' }}
                                        >
                                            {cat} {ui.emoji}
                                        </Button>
                                    ))}
                                </div>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Search expenses..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="rounded-pill shadow-none border-secondary-subtle px-3 py-2"
                                    style={{ maxWidth: '200px' }}
                                />
                            </Card.Body>
                        </Card>

                        {/* EXPENSE HISTORY LIST */}
                        <Card className="border-0 shadow-sm rounded-4 p-2">
                            <Card.Body>
                                {displayedExpenses.length === 0 ? (
                                    <p className="text-muted text-center py-4 mb-0">No expenses found.</p>
                                ) : (
                                    displayedExpenses.map((expense, index) => (
                                        <div key={expense.id} className={`d-flex justify-content-between align-items-center py-3 ${index !== displayedExpenses.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="d-flex align-items-center gap-3">
                                                {/* Icon */}
                                                <div className="d-flex justify-content-center align-items-center rounded-3" style={{ width: '48px', height: '48px', backgroundColor: CATEGORY_UI[expense.category]?.badgeBg || '#f3f4f6', fontSize: '1.25rem' }}>
                                                    {CATEGORY_UI[expense.category]?.icon || '💰'}
                                                </div>
                                                {/* Details */}
                                                <div>
                                                    <h6 className="fw-bold mb-1" style={{ color: '#0F172A' }}>{expense.description}</h6>
                                                    <span className="badge rounded-pill fw-semibold" style={{ backgroundColor: CATEGORY_UI[expense.category]?.badgeBg || '#e5e7eb', color: CATEGORY_UI[expense.category]?.badgeText || '#374151' }}>
                                                        {expense.category}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="text-muted fw-medium">{formatDate(expense.date)}</div>
                                                <div className="fw-bold fs-5" style={{ color: '#0F172A' }}>-${expense.amount.toFixed(2)}</div>
                                                <Button 
                                                    variant="danger" 
                                                    className="d-flex justify-content-center align-items-center rounded-3 border-0" 
                                                    style={{ width: '36px', height: '36px', backgroundColor: '#FEE2E2', color: '#EF4444' }}
                                                    onClick={() => handleDelete(expense.id)}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ExpenseTrackerDashboard;