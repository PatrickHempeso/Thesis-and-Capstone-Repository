import React, { useState, useEffect } from 'react'; // 🛑 Added useEffect
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import axios from '../axiosConfig'; // your custom axios instance

axios.defaults.baseURL = 'http://localhost:8000';

axios.defaults.withCredentials = true;

// Define a simple list of project types
const PROJECT_TYPES = {
    'Thesis': 'Thesis',
    'Capstone': 'Capstone'
};

function SubmitProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectType: '', 
        title: '',
        authors: '', // Will be pre-filled by useEffect
        program: '',
        abstract: '',
        keywords: '',
        adviser: '', // Now supports multiple, comma-separated names
        yearPublished: new Date().getFullYear().toString(), 
    });
    
    // 🛑 NEW STATES for Search Suggestions 🛑
    const [adviserSuggestions, setAdviserSuggestions] = useState([]);
    const [authorSuggestions, setAuthorSuggestions] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    // =========================================================
    // 🛑 NEW EFFECT: Fetch Authenticated Student Name (Pre-fill)
    // =========================================================
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                // Calls the new Laravel endpoint: /api/student/profile
                const response = await axios.get('/api/student/profile');
                const authorName = response.data.name;

                // Set the current student as the initial author
                setFormData(prev => ({ 
                    ...prev, 
                    authors: authorName // Pre-fills the author field
                }));
            } catch (error) {
                console.error("Could not fetch authenticated student profile:", error);
            }
        };
        fetchAuthor();
    }, []); // Runs once on component mount

    // =========================================================
    // 🛑 MODIFIED HANDLER: Handles input change AND search suggestions
    // =========================================================
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // ... (rest of the error handling remains the same)

        // 🛑 CRITICAL FIX: Extract the current word/name for MULTI-SELECT fields 🛑
        let currentQuery = value;

        // Check if the field is 'authors' OR 'adviser'
        if (name === 'authors' || name === 'adviser') { // <--- MODIFIED HERE
            // Split the string by comma, get the last part, and trim it.
            const parts = value.split(',');
            currentQuery = parts[parts.length - 1].trim(); 
        }

        if (currentQuery.length > 2) {
            const endpoint = name === 'adviser' ? '/api/search/faculty' : '/api/search/students';
            
            // Pass the extracted currentQuery
            fetchSuggestions(endpoint, currentQuery, name);
        } else {
            // Clear suggestions if input is too short
            name === 'adviser' ? setAdviserSuggestions([]) : setAuthorSuggestions([]);
        }
    };

    const fetchSuggestions = async (endpoint, query, name) => {
        try {
            const response = await axios.get(endpoint, {
                params: { q: query }
            });

            if (name === 'adviser') {
                setAdviserSuggestions(response.data);
            } else {
                setAuthorSuggestions(response.data);
            }

        } catch (error) {
            console.error(`Search failed for ${name}:`, error);
        }
    };
    
    // =========================================================
    // Standard change handler (for fields that don't need search)
    // =========================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // =========================================================
    // MODIFIED: Handle Selection from Suggestions
    // =========================================================
    const selectSuggestion = (name, suggestedName) => {
        
        // This logic now applies to both 'authors' AND 'adviser'
        if (name === 'authors' || name === 'adviser') { // <--- MODIFIED HERE
            
            // Get the current list of names from the correct field
            const currentList = formData[name];

            // 1. Get the current list of names
            const namesArray = currentList.split(',').map(n => n.trim()).filter(n => n.length > 0);
            
            // 2. Remove the partial text the user was typing (the last element)
            namesArray.pop();
            
            // 3. Add the fully suggested name
            namesArray.push(suggestedName);

            // 4. Update the form data with the full, comma-separated list
            setFormData(prev => ({ 
                ...prev, 
                [name]: namesArray.join(', ') // Use [name] to update either 'authors' or 'adviser'
            }));

        } 
        // Note: Any single-select fields that use selectSuggestion would need an 'else if (name === 'single_field')' block here.

        // Clear suggestions after selection
        name === 'adviser' ? setAdviserSuggestions([]) : setAuthorSuggestions([]);
    };


    const validateForm = () => {
        const newErrors = {};

        // 1. Basic Field Validations (unchanged)
        if (!formData.projectType) newErrors.projectType = 'Project type is required';
        if (!formData.title.trim()) newErrors.title = 'Project title is required';
        if (!formData.authors.trim()) newErrors.authors = 'Author(s) are required';
        if (!formData.program) newErrors.program = 'Please select a program';
        if (!formData.keywords.trim()) newErrors.keywords = 'Keywords are required';
        if (!formData.adviser.trim()) newErrors.adviser = 'Adviser is required';

        // 2. Abstract Word Count Validation (unchanged)
        const wordCount = formData.abstract.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount < 200) newErrors.abstract = `Abstract must be at least 200 words (currently ${wordCount})`;
        
        // 3. Year Validation (unchanged)
        const currentYear = new Date().getFullYear();
        const yearInt = parseInt(formData.yearPublished);
        if (isNaN(yearInt) || yearInt < 1900 || yearInt > currentYear) {
            newErrors.yearPublished = `Year must be a valid year between 1900 and ${currentYear}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fix the errors in the form.');
            return;
        }

        setLoading(true);
        
        const submitData = { ...formData };
        delete submitData.projectType; 

        const endpoint = formData.projectType === PROJECT_TYPES.Thesis ? '/api/thesis/submit-metadata' : '/api/capstone/submit-metadata';
        
        try {
            const response = await axios.post(endpoint, submitData);

            console.log('Project submission successful:', response.data);
            alert(`Project (${formData.projectType}) metadata submitted successfully! Project ID: ${response.data.id}`);
            navigate('/dashboard/student');
        } catch (error) {
            console.error('Project submission failed:', error);
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred during submission.';
            alert(`Submission Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const wordCount = formData.abstract.split(/\s+/).filter(w => w.length > 0).length;
    const isAbstractValid = wordCount >= 200;

    // Standard JSX styles (unchanged)
    const inputStyle = { fontSize: '1.2rem', padding: '10px' };

    return (
        <div className="app-container">
            <AppHeader title="SUBMIT PROJECT" />

            <div
                className="dashboard-container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    gap: '30px'
                }}
            >
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between' }}>
                    <Link to="/dashboard/student" className="btn btn-secondary">← Back to Dashboard</Link>
                </div>

                <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <h2 className="section-title">Submit Project Details</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* 1. Project Type (unchanged) */}
                        <select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className={errors.projectType ? 'error' : ''}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Project Type (Thesis/Capstone)</option>
                            <option value={PROJECT_TYPES.Thesis}>Thesis</option>
                            <option value={PROJECT_TYPES.Capstone}>Capstone</option>
                        </select>
                        {errors.projectType && <p className="error-text">{errors.projectType}</p>}

                        {/* 2. Project Title (unchanged) */}
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            value={formData.title}
                            onChange={handleChange}
                            className={errors.title ? 'error' : ''}
                            style={inputStyle}
                            required
                        />
                        {errors.title && <p className="error-text">{errors.title}</p>}

                        {/* 3. Authors (Uses handleSearchChange and displays suggestions) */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="authors"
                                placeholder="Author(s) (comma separated)"
                                value={formData.authors}
                                onChange={handleSearchChange} // 🛑 Uses new handler
                                className={errors.authors ? 'error' : ''}
                                style={inputStyle}
                                required
                            />
                            {authorSuggestions.length > 0 && (
                                <ul style={suggestionListStyle}>
                                    {authorSuggestions.map((suggestion) => (
                                        <li key={suggestion.id} onClick={() => selectSuggestion('authors', suggestion.name)} style={suggestionItemStyle}>
                                            {suggestion.name} ({suggestion.details})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.authors && <p className="error-text">{errors.authors}</p>}

                        {/* 4. Program (unchanged) */}
                        <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className={errors.program ? 'error' : ''}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Program</option>
                            <option value="BSIT-IS">BSIT-IS</option>
                            <option value="BSIT-BTM">BSIT-BTM</option>
                            <option value="BSCS">BSCS</option>
                            <option value="BLIS">BLIS</option>
                            <option value="MIT">MIT</option>
                            <option value="DIT">DIT</option>
                        </select>
                        {errors.program && <p className="error-text">{errors.program}</p>}

                        {/* 5. Abstract (unchanged) */}
                        <textarea
                            name="abstract"
                            placeholder="Project Abstract (minimum 200 words)"
                            value={formData.abstract}
                            onChange={handleChange}
                            rows="10"
                            className={errors.abstract ? 'error' : ''}
                            style={{ fontSize: '1.1rem', padding: '10px' }}
                        />
                        <div className={`word-count ${isAbstractValid ? 'adequate' : 'low'}`} style={{ textAlign: 'left', marginTop: '-10px', color: isAbstractValid ? 'green' : 'red' }}>
                            Word count: {wordCount} {!isAbstractValid && `(Need ${200 - wordCount} more words)`}
                        </div>
                        {errors.abstract && <p className="error-text">{errors.abstract}</p>}


                        {/* 6. Keywords (unchanged) */}
                        <input
                            type="text"
                            name="keywords"
                            placeholder="Keywords (comma separated)"
                            value={formData.keywords}
                            onChange={handleChange}
                            className={errors.keywords ? 'error' : ''}
                            style={inputStyle}
                            required
                        />
                        {errors.keywords && <p className="error-text">{errors.keywords}</p>}

                        {/* 7. Adviser (Uses handleSearchChange and displays suggestions) */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="adviser"
                                placeholder="Adviser Name(s) (comma separated)" // Added plural/hint
                                value={formData.adviser}
                                onChange={handleSearchChange} // 🛑 Uses new handler
                                className={errors.adviser ? 'error' : ''}
                                style={inputStyle}
                                required
                            />
                            {adviserSuggestions.length > 0 && (
                                <ul style={suggestionListStyle}>
                                    {adviserSuggestions.map((suggestion) => (
                                        <li key={suggestion.id} onClick={() => selectSuggestion('adviser', suggestion.name)} style={suggestionItemStyle}>
                                            {suggestion.name} ({suggestion.details})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.adviser && <p className="error-text">{errors.adviser}</p>}


                        {/* 8. Year Published (unchanged) */}
                        <input
                            type="number"
                            name="yearPublished"
                            placeholder="Year Published (e.g., 2024)"
                            value={formData.yearPublished}
                            onChange={handleChange}
                            className={errors.yearPublished ? 'error' : ''}
                            style={inputStyle}
                            required
                        />
                        {errors.yearPublished && <p className="error-text">{errors.yearPublished}</p>}

                        <button type="submit" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '10px' }} disabled={loading}>
                            {loading ? 'Submitting Details...' : 'Submit Project Details'}
                        </button>
                        <Link to="/dashboard/student" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '10px' }}>
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>

            <UniversityFooter />
        </div>
    );
}

const suggestionListStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    zIndex: 1000,
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left'
};

const suggestionItemStyle = {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee'
};

// Add hover effect for better UX
suggestionItemStyle[':hover'] = {
    backgroundColor: '#f0f0f0'
};


export default SubmitProject;