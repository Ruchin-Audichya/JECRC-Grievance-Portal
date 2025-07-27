# JECRC Grievance Portal - Demo Guide 📋

**For**: JECRC University IT Cell Team  
**Prepared by**: Ruchin Audichya (23BCON0208)  
**Review by**: CP Beniwal Sir

---

## 🚀 Quick Start - Demo Portal

The easiest way to test all features is through our **Demo Portal**.

### Access Demo Portal:
1. Open the portal in your browser
2. Click on **"Demo Portal"** from the sidebar (visible to admins)
3. You'll see 4 demo accounts ready to use

### Demo Accounts Available:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Student** | student@jecrcu.edu.in | password123 | File and track grievances |
| **Staff** | staff@jecrcu.edu.in | password123 | Same as student (faculty/staff) |
| **Resolver** | resolver@jecrcu.edu.in | password123 | Handle grievances |
| **Admin** | admin@jecrcu.edu.in | password123 | System management |

**Note**: If accounts don't exist, they'll be created automatically on first login attempt.

---

## 🧪 Testing Each Feature

### 1. Anonymous Grievance Submission (NEW!) 🔒

**As Student/Staff:**
1. Click **"File Grievance"** button
2. Fill in the form
3. ✅ Check **"Submit this grievance anonymously"**
4. Click **"Submit Grievance"**
5. The grievance will show creator as **"Anonymous Submission"**

**Why this matters**: Students can report sensitive issues without fear.

### 2. Formal Grievance Workflow (NEW!) 📋

The system now uses professional statuses:

| Old Status | New Status | Meaning |
|------------|------------|---------|
| Open | **Submitted** | Just filed |
| In Progress | **Under Review** | Being investigated |
| - | **Action Taken** | Action completed |
| Resolved | **Resolved** | Awaiting confirmation |
| Closed | **Appealed** | User appealed decision |

**Test the workflow:**
1. Student files grievance → Status: **Submitted**
2. Resolver changes to **Under Review**
3. Resolver changes to **Action Taken**
4. Resolver changes to **Resolved**
5. Student can either:
   - Click **"Yes, Close Ticket"** → Ends process
   - Click **"No, Appeal Decision"** → Status: **Appealed**

### 3. Multi-Level Escalation (NEW!) 📈

**As Resolver/Admin:**
1. Open any grievance
2. In the Actions section, find **"Escalate Grievance To:"**
3. Select from dropdown:
   - Dean of Student Affairs
   - Academic Council
   - University Proctor
   - Vice Chancellor
4. System logs the escalation automatically

### 4. Complete Ticket Lifecycle

**Step 1: File Grievance (Student/Staff)**
- Click **"File Grievance"**
- Fill title, description, category, priority
- Optional: Check anonymous submission
- Submit

**Step 2: Handle Grievance (Resolver)**
- View assigned grievances in dashboard
- Click on grievance to open
- Change status as investigation progresses
- Add internal notes (not visible to students)
- Can escalate if needed

**Step 3: Resolution (Resolver)**
- Change status to **"Resolved"**
- Add resolution details

**Step 4: Verification (Student/Staff)**
- See prominent **"Ticket Resolution Confirmation"** box
- Either close or appeal

### 5. User History & Context (NEW!)

**As Resolver/Admin:**
1. Open any grievance
2. Click on the creator's name (blue link)
3. View complete user profile:
   - Total grievances filed
   - History of all grievances
   - Department/Role info
4. Click any past grievance to view

**Note**: Anonymous submissions don't have clickable names.

### 6. Bulk Operations (NEW!) 💪

**As Admin:**

**For Users:**
1. Go to Admin Portal → User Management
2. Select multiple users using checkboxes
3. Choose bulk action: Deactivate, Change Role, Delete
4. Click Apply

**For Tickets:**
1. Go to Admin Portal → Ticket Management
2. Select multiple tickets
3. Choose bulk action: Change Status, Assign, Delete
4. Click Apply

### 7. Knowledge Base (NEW!) 📚

**Creating Articles (Resolver/Admin):**
1. Open a resolved grievance
2. Click **"Create Knowledge Base Article"**
3. System pre-fills from ticket info
4. Edit and save

**Viewing Articles (All Users):**
1. Click **"Knowledge Base"** in sidebar
2. Search or filter by category
3. View solutions to common issues

---

## 🎯 Key Features to Demonstrate

### For CP Beniwal Sir:

1. **Professional Tone**
   - No more "tickets" → Now "grievances"
   - Formal status workflow
   - Professional language throughout

2. **Confidentiality**
   - Anonymous submission option
   - Confidentiality notice
   - Internal notes for resolvers

3. **Accountability**
   - Complete audit trail
   - User history tracking
   - Escalation paths

4. **Efficiency**
   - Bulk operations
   - Auto-assignment
   - Knowledge base

### For IT Cell Testing:

1. **Security Testing**
   - Try accessing other users' grievances (should fail)
   - Test anonymous submissions
   - Check role-based permissions

2. **Workflow Testing**
   - Complete full lifecycle
   - Test escalations
   - Try appeal process

3. **Performance Testing**
   - File multiple grievances
   - Test with many users
   - Check search functionality

---

## 📱 Mobile Testing

The portal is fully responsive. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Key mobile features:
- Hamburger menu
- Touch-friendly buttons
- Responsive forms
- Swipe gestures

---

## 🔍 Common Test Scenarios

### Scenario 1: Harassment Complaint
1. Student files anonymous grievance
2. Resolver investigates privately
3. Escalates to Dean if needed
4. Resolution with confidentiality

### Scenario 2: Academic Appeal
1. Student files grievance about grades
2. Assigned to Academic department
3. Goes through formal review
4. Student can appeal if unsatisfied

### Scenario 3: Infrastructure Issue
1. Staff reports broken equipment
2. Auto-assigned to maintenance
3. Quick resolution
4. Knowledge base article created

---

## ⚠️ Important Testing Notes

1. **Anonymous Grievances**
   - Cannot be traced back to user
   - Still follow same workflow
   - Extra confidentiality measures

2. **Escalation Chain**
   - Each level has more authority
   - Automatic notifications
   - Complete audit trail

3. **Appeal Process**
   - Only available after resolution
   - Reopens for higher review
   - Cannot be closed by resolver

---

## 🛠️ Troubleshooting

### Issue: Can't login
- Check email/password
- For demo accounts, wait for auto-creation
- Clear browser cache

### Issue: Can't see buttons
- Check your role permissions
- Some features are role-specific
- Refresh the page

### Issue: Grievance not updating
- Check internet connection
- Refresh to see latest status
- Contact IT support

---

## 📞 Support During Demo

**Technical Issues:**
- Developer: Ruchin Audichya (23BCON0208)
- IT Cell: [Contact provided separately]

**Process Questions:**
- Refer to main documentation
- Check Knowledge Base
- Contact administrative office

---

## ✅ Demo Checklist

Before presenting to CP Beniwal Sir, ensure:

- [ ] All 4 demo accounts working
- [ ] Anonymous submission tested
- [ ] Full workflow demonstrated
- [ ] Escalation shown
- [ ] Bulk operations working
- [ ] Knowledge base has sample articles
- [ ] Mobile view tested
- [ ] Professional language throughout

---

**Remember**: This is a professional grievance system designed for serious institutional matters. Demonstrate accordingly.

*Made with dedication for JECRC University* 🏛️