# End-to-End Tests

## Setup
```bash
npm install -D @playwright/test
npx playwright install
```

## Run Tests
```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test auth.spec.ts

# Run in UI mode
npx playwright test --ui

# Generate report
npx playwright show-report
```

## Test Structure
- `auth.spec.ts` - Authentication flows
- `visa-browsing.spec.ts` - Visa browsing and search
- `payments.spec.ts` - Payment and checkout
- `lawyer-flow.spec.ts` - Lawyer registration and booking
- `admin.spec.ts` - Admin panel