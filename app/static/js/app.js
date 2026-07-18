// Global application state
const state = {
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    role: localStorage.getItem("role") || null,
    questions: [], // Admin view or raw questions list
    categories: [],
    // Quiz taking state
    activeQuiz: {
        category: "",
        questions: [],
        currentIndex: 0,
        score: 0,
        selectedChoiceId: null,
        answers: [] // Track whether each answer was correct
    }
};

// DOM Elements
const authSection = document.getElementById("authSection");
const studentDashboard = document.getElementById("studentDashboard");
const adminDashboard = document.getElementById("adminDashboard");
const appHeader = document.getElementById("appHeader");
const usernameDisplay = document.getElementById("usernameDisplay");
const roleBadge = document.getElementById("roleBadge");
const avatarLetter = document.getElementById("avatarLetter");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");
const logoutBtn = document.getElementById("logoutBtn");

// Student view elements
const categoriesGrid = document.getElementById("categoriesGrid");
const quizContainer = document.getElementById("quizContainer");
const quizResultsCard = document.getElementById("quizResultsCard");
const quizCategoryTag = document.getElementById("quizCategoryTag");
const quizQuestionCounter = document.getElementById("quizQuestionCounter");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizChoicesList = document.getElementById("quizChoicesList");
const quizProgressFill = document.getElementById("quizProgressFill");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const backToDashBtn = document.getElementById("backToDashBtn");

// Admin view elements
const openAddQuestionModalBtn = document.getElementById("openAddQuestionModalBtn");
const adminCategoryFilter = document.getElementById("adminCategoryFilter");
const questionsTableBody = document.getElementById("questionsTableBody");
const statTotalQuestions = document.getElementById("statTotalQuestions");
const statTotalCategories = document.getElementById("statTotalCategories");
const statTotalChoices = document.getElementById("statTotalChoices");

// Modal elements
const questionModal = document.getElementById("questionModal");
const modalTitle = document.getElementById("modalTitle");
const questionForm = document.getElementById("questionForm");
const modalQuestionId = document.getElementById("modalQuestionId");
const modalQuestionText = document.getElementById("modalQuestionText");
const modalQuestionCategory = document.getElementById("modalQuestionCategory");
const modalChoicesList = document.getElementById("modalChoicesList");
const addChoiceFieldBtn = document.getElementById("addChoiceFieldBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Toast Notification
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === "error") {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    } else if (type === "info") {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toast.classList.remove("hidden");
    
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

// Request Helper
async function apiRequest(endpoint, options = {}) {
    const headers = { ...options.headers };
    if (state.token) {
        headers["Authorization"] = `Bearer ${state.token}`;
    }
    
    if (options.body && !(options.body instanceof URLSearchParams)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(endpoint, { ...options, headers });
        if (response.status === 401) {
            handleLogout();
            showToast("Session expired. Please log in again.", "error");
            throw new Error("Unauthorized");
        }
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Something went wrong");
        }
        return data;
    } catch (error) {
        if (error.message !== "Unauthorized") {
            console.error(`API Error on ${endpoint}:`, error);
        }
        throw error;
    }
}

// Screen Transitions
function showSection(section) {
    authSection.classList.add("hidden");
    studentDashboard.classList.add("hidden");
    adminDashboard.classList.add("hidden");
    
    section.classList.remove("hidden");
}

// Auth Actions
async function checkAuth() {
    if (!state.token) {
        showSection(authSection);
        appHeader.classList.add("hidden");
        return;
    }
    
    try {
        const user = await apiRequest("/auth/me");
        state.role = user.role;
        state.username = user.username;
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username);
        
        usernameDisplay.textContent = state.username;
        avatarLetter.textContent = state.username.charAt(0).toUpperCase();
        roleBadge.textContent = state.role;
        roleBadge.className = `badge ${state.role === "admin" ? "admin-badge" : ""}`;
        
        appHeader.classList.remove("hidden");
        
        if (state.role === "admin") {
            showSection(adminDashboard);
            loadAdminDashboard();
        } else {
            showSection(studentDashboard);
            loadStudentDashboard();
        }
    } catch (error) {
        handleLogout();
    }
}

function handleLogout() {
    state.token = null;
    state.username = null;
    state.role = null;
    localStorage.clear();
    showSection(authSection);
    appHeader.classList.add("hidden");
}

// Event Listeners for Auth UI toggles
showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    document.querySelector(".auth-card p").textContent = "Create your new account";
});

showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    document.querySelector(".auth-card p").textContent = "Enter your credentials to access the platform";
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    
    try {
        const data = await apiRequest("/auth/token", {
            method: "POST",
            body: params
        });
        
        state.token = data.access_token;
        state.username = data.username;
        state.role = data.role;
        
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        
        showToast(`Welcome back, ${state.username}!`);
        loginForm.reset();
        checkAuth();
    } catch (error) {
        showToast(error.message, "error");
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const role = document.querySelector('input[name="registerRole"]:checked').value;
    
    try {
        await apiRequest("/auth/register", {
            method: "POST",
            body: { username, password, role }
        });
        
        showToast("Registration successful! You can now log in.");
        registerForm.reset();
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    } catch (error) {
        showToast(error.message, "error");
    }
});

logoutBtn.addEventListener("click", () => {
    handleLogout();
    showToast("Logged out successfully");
});

// STUDENT DASHBOARD LOGIC
async function loadStudentDashboard() {
    categoriesGrid.classList.remove("hidden");
    quizContainer.classList.add("hidden");
    quizResultsCard.classList.add("hidden");
    
    categoriesGrid.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading challenging quizzes...</div>`;
    
    try {
        const questions = await apiRequest("/questions");
        state.questions = questions;
        
        // Group by category
        const categoriesMap = {};
        questions.forEach(q => {
            const cat = q.category || "General";
            if (!categoriesMap[cat]) {
                categoriesMap[cat] = 0;
            }
            categoriesMap[cat]++;
        });
        
        categoriesGrid.innerHTML = "";
        
        const categories = Object.keys(categoriesMap);
        if (categories.length === 0) {
            categoriesGrid.innerHTML = `
                <div class="category-card" style="grid-column: 1/-1; text-align: center; justify-content: center; align-items: center;">
                    <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted);"></i>
                    <h3>No Quizzes Available</h3>
                    <p>Ask an Admin to create some questions in the database!</p>
                </div>
            `;
            return;
        }
        
        categories.forEach(cat => {
            const count = categoriesMap[cat];
            const card = document.createElement("div");
            card.className = "category-card";
            
            // Map category names to icons for visual wow factor
            let iconClass = "fa-solid fa-circle-question";
            const lowerCat = cat.toLowerCase();
            if (lowerCat.includes("science") || lowerCat.includes("data")) iconClass = "fa-solid fa-chart-line";
            else if (lowerCat.includes("code") || lowerCat.includes("program") || lowerCat.includes("python")) iconClass = "fa-solid fa-code";
            else if (lowerCat.includes("math")) iconClass = "fa-solid fa-square-root-variable";
            else if (lowerCat.includes("general") || lowerCat.includes("knowledge")) iconClass = "fa-solid fa-globe";
            else if (lowerCat.includes("business")) iconClass = "fa-solid fa-briefcase";
            
            card.innerHTML = `
                <div class="category-icon"><i class="${iconClass}"></i></div>
                <h3>${cat}</h3>
                <p>Test your competence in ${cat} questions compiled by educational experts.</p>
                <div class="category-meta">
                    <span><i class="fa-regular fa-file-lines"></i> ${count} Questions</span>
                    <button class="btn btn-primary btn-sm start-quiz-btn" data-category="${cat}">Start</button>
                </div>
            `;
            
            categoriesGrid.appendChild(card);
        });
        
        // Add listeners to start quiz
        document.querySelectorAll(".start-quiz-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const category = e.target.dataset.category;
                startQuiz(category);
            });
        });
        
    } catch (error) {
        showToast("Failed to load questions: " + error.message, "error");
    }
}

function startQuiz(category) {
    const qList = state.questions.filter(q => (q.category || "General") === category);
    if (qList.length === 0) return;
    
    state.activeQuiz = {
        category: category,
        questions: qList,
        currentIndex: 0,
        score: 0,
        selectedChoiceId: null,
        answers: []
    };
    
    categoriesGrid.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    quizResultsCard.classList.add("hidden");
    
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const quiz = state.activeQuiz;
    const currentQ = quiz.questions[quiz.currentIndex];
    
    quizCategoryTag.textContent = quiz.category;
    quizQuestionCounter.textContent = `Question ${quiz.currentIndex + 1} of ${quiz.questions.length}`;
    quizQuestionText.textContent = currentQ.question_text;
    
    // Progress fill
    const percent = ((quiz.currentIndex) / quiz.questions.length) * 100;
    quizProgressFill.style.width = `${percent}%`;
    
    quizChoicesList.innerHTML = "";
    nextQuestionBtn.disabled = true;
    quiz.selectedChoiceId = null;
    
    if (!currentQ.choices || currentQ.choices.length === 0) {
        quizChoicesList.innerHTML = `<p class="text-muted">No choices available for this question.</p>`;
        nextQuestionBtn.disabled = false;
        return;
    }
    
    currentQ.choices.forEach((choice, idx) => {
        const item = document.createElement("div");
        item.className = "choice-item";
        item.dataset.choiceId = choice.id;
        
        // letter prefix A, B, C, D
        const letter = String.fromCharCode(65 + idx);
        
        item.innerHTML = `
            <div class="choice-circle">${letter}</div>
            <div class="choice-text">${choice.choice_text}</div>
        `;
        
        item.addEventListener("click", () => handleChoiceSelection(item, choice, currentQ.choices));
        quizChoicesList.appendChild(item);
    });
}

function handleChoiceSelection(selectedItem, chosenChoice, allChoices) {
    const quiz = state.activeQuiz;
    if (quiz.selectedChoiceId !== null) return; // Prevent changing answer
    
    quiz.selectedChoiceId = chosenChoice.id;
    nextQuestionBtn.disabled = false;
    
    // Evaluate answer instantly for wow factor interactive learning feedback!
    const isCorrect = chosenChoice.is_correct;
    if (isCorrect) {
        quiz.score++;
        selectedItem.classList.add("correct");
        showToast("Correct Answer!", "success");
    } else {
        selectedItem.classList.add("incorrect");
        
        // Find correct choice and highlight it in green
        document.querySelectorAll(".choice-item").forEach(item => {
            const cId = parseInt(item.dataset.choiceId);
            const matchingChoice = allChoices.find(c => c.id === cId);
            if (matchingChoice && matchingChoice.is_correct) {
                item.classList.add("correct");
            }
        });
        showToast("Incorrect Answer", "error");
    }
    
    // Disable all options
    document.querySelectorAll(".choice-item").forEach(item => {
        item.classList.add("disabled");
    });
}

nextQuestionBtn.addEventListener("click", () => {
    const quiz = state.activeQuiz;
    quiz.currentIndex++;
    
    if (quiz.currentIndex < quiz.questions.length) {
        loadQuizQuestion();
    } else {
        // Complete Quiz and show results
        finishQuiz();
    }
});

function finishQuiz() {
    const quiz = state.activeQuiz;
    quizProgressFill.style.width = "100%";
    
    quizContainer.classList.add("hidden");
    quizResultsCard.classList.remove("hidden");
    
    document.getElementById("correctAnswersCount").textContent = quiz.score;
    document.getElementById("totalQuestionsCount").textContent = quiz.questions.length;
    
    const scorePercentage = Math.round((quiz.score / quiz.questions.length) * 100);
    document.getElementById("resultsPercentageText").textContent = `${scorePercentage}%`;
    
    // Animate circular chart stroke-dasharray (length is 2 * pi * radius = 2 * 3.14 * 15.91 = 100)
    const circle = document.getElementById("resultsPercentageCircle");
    circle.setAttribute("stroke-dasharray", `${scorePercentage}, 100`);
}

restartQuizBtn.addEventListener("click", () => {
    startQuiz(state.activeQuiz.category);
});

backToDashBtn.addEventListener("click", () => {
    loadStudentDashboard();
});

// ADMIN DASHBOARD LOGIC
async function loadAdminDashboard() {
    try {
        const questions = await apiRequest("/questions");
        const choices = await apiRequest("/choices");
        
        state.questions = questions;
        
        // Populate analytics metrics
        statTotalQuestions.textContent = questions.length;
        statTotalChoices.textContent = choices.length;
        
        const categories = [...new Set(questions.map(q => q.category).filter(Boolean))];
        state.categories = categories;
        statTotalCategories.textContent = categories.length;
        
        // Populate Category Filter
        const activeFilterVal = adminCategoryFilter.value;
        adminCategoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            adminCategoryFilter.appendChild(opt);
        });
        adminCategoryFilter.value = activeFilterVal;
        
        renderAdminQuestions();
    } catch (error) {
        showToast("Failed to fetch admin stats: " + error.message, "error");
    }
}

adminCategoryFilter.addEventListener("change", () => {
    renderAdminQuestions();
});

function renderAdminQuestions() {
    const selectedCategory = adminCategoryFilter.value;
    let filteredQuestions = state.questions;
    
    if (selectedCategory) {
        filteredQuestions = state.questions.filter(q => q.category === selectedCategory);
    }
    
    questionsTableBody.innerHTML = "";
    
    if (filteredQuestions.length === 0) {
        questionsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    <i class="fa-solid fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No questions match this filter.
                </td>
            </tr>
        `;
        return;
    }
    
    filteredQuestions.forEach(q => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>#${q.id}</strong></td>
            <td><div style="max-width: 450px; font-weight: 500;">${q.question_text}</div></td>
            <td><span class="badge">${q.category || "General"}</span></td>
            <td><span style="font-weight: 600;">${q.choices ? q.choices.length : 0}</span> choices</td>
            <td class="actions-cell">
                <button class="btn btn-outline btn-icon edit-question-btn" data-id="${q.id}" title="Edit Question">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn btn-danger btn-icon delete-question-btn" data-id="${q.id}" title="Delete Question">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </td>
        `;
        questionsTableBody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll(".edit-question-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const qId = parseInt(btn.dataset.id);
            openQuestionModal(qId);
        });
    });
    
    document.querySelectorAll(".delete-question-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const qId = parseInt(btn.dataset.id);
            confirmDeleteQuestion(qId);
        });
    });
}

// MODAL CRUD FUNCTIONS
let choiceIndexCounter = 0;

function createChoiceRow(choiceText = "", isCorrect = false, choiceId = null) {
    const idx = choiceIndexCounter++;
    const row = document.createElement("div");
    row.className = "modal-choice-row";
    row.dataset.index = idx;
    if (choiceId) row.dataset.choiceId = choiceId;
    
    row.innerHTML = `
        <label class="correct-checker" title="Mark as correct answer">
            <input type="radio" name="modalCorrectChoice" value="${idx}" ${isCorrect ? 'checked' : ''}>
            <i class="fa-solid fa-circle-check"></i>
        </label>
        <input type="text" class="choice-text-input" placeholder="Enter option text" value="${choiceText}" required>
        <button type="button" class="remove-choice-btn" title="Remove choice">&times;</button>
    `;
    
    row.querySelector(".remove-choice-btn").addEventListener("click", () => {
        row.remove();
    });
    
    // If radio is checked, ensure the radio checked value stays correct
    modalChoicesList.appendChild(row);
}

// Open modal for Creating (no ID) or Editing (ID passed)
async function openQuestionModal(questionId = null) {
    modalChoicesList.innerHTML = "";
    choiceIndexCounter = 0;
    
    if (questionId) {
        modalTitle.textContent = "Edit Question Details";
        modalQuestionId.value = questionId;
        
        try {
            const q = await apiRequest(`/questions/${questionId}`);
            modalQuestionText.value = q.question_text;
            modalQuestionCategory.value = q.category || "";
            
            if (q.choices && q.choices.length > 0) {
                q.choices.forEach(choice => {
                    createChoiceRow(choice.choice_text, choice.is_correct, choice.id);
                });
            } else {
                // Pre-populate with a couple empty ones
                createChoiceRow("", false);
                createChoiceRow("", false);
            }
        } catch (error) {
            showToast("Failed to load question details: " + error.message, "error");
            return;
        }
    } else {
        modalTitle.textContent = "Add New Quiz Question";
        modalQuestionId.value = "";
        modalQuestionText.value = "";
        modalQuestionCategory.value = "";
        
        // Add 4 empty choice rows by default
        createChoiceRow("", true); // First one checked by default
        createChoiceRow("", false);
        createChoiceRow("", false);
        createChoiceRow("", false);
    }
    
    questionModal.classList.remove("hidden");
}

function closeQuestionModal() {
    questionModal.classList.add("hidden");
}

addChoiceFieldBtn.addEventListener("click", () => {
    createChoiceRow("", false);
});

cancelModalBtn.addEventListener("click", closeQuestionModal);
closeModalBtn.addEventListener("click", closeQuestionModal);

openAddQuestionModalBtn.addEventListener("click", () => {
    openQuestionModal();
});

// Save question form submit
questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const qId = modalQuestionId.value;
    const qText = modalQuestionText.value.trim();
    const qCategory = modalQuestionCategory.value.trim();
    
    // Gather choices
    const choiceRows = modalChoicesList.querySelectorAll(".modal-choice-row");
    if (choiceRows.length < 2) {
        showToast("A question must have at least 2 answer choices.", "error");
        return;
    }
    
    const checkedRadio = modalChoicesList.querySelector('input[name="modalCorrectChoice"]:checked');
    if (!checkedRadio) {
        showToast("Please mark one choice as correct.", "error");
        return;
    }
    const correctIdx = checkedRadio.value;
    
    const choicesData = [];
    choiceRows.forEach(row => {
        const index = row.dataset.index;
        const text = row.querySelector(".choice-text-input").value.trim();
        const isCorrect = (index === correctIdx);
        const id = row.dataset.choiceId ? parseInt(row.dataset.choiceId) : null;
        
        choicesData.push({ text, isCorrect, id });
    });
    
    try {
        if (qId) {
            // EDITING existing question
            const questionId = parseInt(qId);
            
            // 1. Update the Question model itself
            await apiRequest(`/questions/${questionId}`, {
                method: "PUT",
                body: { question_text: qText, category: qCategory }
            });
            
            // 2. Manage choices: Since SQLite is simple, the clean implementation is:
            // Fetch current choices in DB, delete any choices that are NOT in our list, 
            // and update/insert choices. Let's do that!
            const dbQuestion = await apiRequest(`/questions/${questionId}`);
            const dbChoices = dbQuestion.choices || [];
            
            // Delete choices from database if they were removed in UI
            const uiChoiceIds = choicesData.map(c => c.id).filter(Boolean);
            for (let dbC of dbChoices) {
                if (!uiChoiceIds.includes(dbC.id)) {
                    await apiRequest(`/choices/${dbC.id}`, { method: "DELETE" });
                }
            }
            
            // Update or Create choices
            for (let c of choicesData) {
                if (c.id) {
                    // Update
                    await apiRequest(`/choices/${c.id}`, {
                        method: "PUT",
                        body: { choice_text: c.text, is_correct: c.isCorrect, question_id: questionId }
                    });
                } else {
                    // Create
                    await apiRequest("/choices", {
                        method: "POST",
                        body: { choice_text: c.text, is_correct: c.isCorrect, question_id: questionId }
                    });
                }
            }
            
            showToast("Question and answer choices updated successfully!");
        } else {
            // CREATING a new question (nested choices payload supported by POST /questions)
            const payloadChoices = choicesData.map(c => ({
                choice_text: c.text,
                is_correct: c.isCorrect
            }));
            
            await apiRequest("/questions", {
                method: "POST",
                body: {
                    question_text: qText,
                    category: qCategory,
                    choices: payloadChoices
                }
            });
            
            showToast("New question created successfully!");
        }
        
        closeQuestionModal();
        loadAdminDashboard();
    } catch (error) {
        showToast("Error saving question: " + error.message, "error");
    }
});

// Delete question
async function confirmDeleteQuestion(questionId) {
    if (confirm(`Are you sure you want to delete Question #${questionId}? This will automatically delete all its associated answer choices.`)) {
        try {
            const data = await apiRequest(`/questions/${questionId}`, {
                method: "DELETE"
            });
            showToast(data.detail || "Question deleted successfully.");
            loadAdminDashboard();
        } catch (error) {
            showToast("Failed to delete question: " + error.message, "error");
        }
    }
}

// Initial authentication checking
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
