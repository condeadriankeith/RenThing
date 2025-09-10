# Logo Replacement Design Document

## Overview
This document outlines the process for replacing the current RenThing logo with the new "RenThing_Logo.png" across the entire platform, including both web and mobile applications. The replacement will ensure consistent branding throughout all user touchpoints.

## Current Logo Usage Analysis

### Web Application
The current logo is used in the following locations:
1. **Header Component** - Main navigation logo (`components/header.tsx`)
2. **Login Page** - Authentication screen (`app/auth/login/page.tsx`)
3. **Registration Page** - Account creation screen (`app/auth/register/page.tsx`)
4. **Footer** - Site-wide footer on homepage (`app/page.tsx`)
5. **Receipts** - Payment receipt templates (`app/api/receipts/[transactionId]/route.ts`)

The current logo file is stored as `RenThing_LOGO.svg` in the `public/` directory.

### Mobile Application
The current logo is used in several locations:
1. **Splash Screen** - Initial app loading screen (`mobile/src/screens/SplashScreen.tsx`)
2. **Header Component** - Navigation header (`mobile/src/components/Header.tsx`)
3. **Login Screen** - Authentication screen (`mobile/src/screens/auth/LoginScreen.tsx`)
4. **Registration Screen** - Account creation screen (`mobile/src/screens/auth/RegisterScreen.tsx`)
5. **Landing Screen** - Main landing page (`mobile/src/screens/LandingScreen.tsx`)
6. **App Icon** - Mobile app icon configuration (`mobile/app.json`)

The current logo files are stored in `mobile/assets/` directory:
- `icon.png` - Main app icon
- `RenThing_LOGO.svg` - SVG version
- Other related assets

## Replacement Strategy

### 1. Web Application Replacement

#### File Management
- Replace `public/RenThing_LOGO.svg` with the new `RenThing_Logo.png`
- Rename the new file to maintain consistent naming: `RenThing_LOGO.png`

#### Code Updates
Update image source references in the following files:
1. `components/header.tsx` - Update src attribute and styling
2. `app/auth/login/page.tsx` - Update src attribute and styling
3. `app/auth/register/page.tsx` - Update src attribute and styling
4. `app/page.tsx` - Update src attribute and styling in footer
5. `app/api/receipts/[transactionId]/route.ts` - Update text-based logo to reference new image

### 2. Mobile Application Replacement

#### File Management
Replace the following files in `mobile/assets/`:
- `icon.png` with the new logo (properly sized for mobile icons)
- `RenThing_LOGO.svg` with the new logo (in PNG format or properly converted)
- Update any other logo assets as needed

#### Code Updates
Update image references in the following files:
1. `mobile/src/screens/SplashScreen.tsx` - Update require path
2. `mobile/src/components/Header.tsx` - Update require path
3. `mobile/src/screens/auth/LoginScreen.tsx` - Update require path
4. `mobile/src/screens/auth/RegisterScreen.tsx` - Update require path
5. `mobile/app.json` - Verify icon path is correct

### 3. Additional Components
Some components use custom SVG implementations:
- `mobile/src/components/RenThingLogo.tsx` - May need to be updated or replaced
- `components/ui/spinning-logo.tsx` - May need to be updated

## Implementation Steps

### Phase 1: Preparation
1. Create backup of current logo files
2. Prepare new logo in required formats and sizes:
   - Web: PNG format, multiple sizes for responsive design
   - Mobile: PNG format, multiple sizes for different device resolutions
   - SVG version for vector scalability

### Phase 2: Web Application Updates
1. Replace logo file in `public/` directory
2. Update header component (`components/header.tsx`)
3. Update authentication pages (login and register)
4. Update homepage footer
5. Update receipt templates
6. Test all changes across different browsers and devices

### Phase 3: Mobile Application Updates
1. Replace logo files in `mobile/assets/` directory
2. Update mobile app configuration (`mobile/app.json`)
3. Update splash screen component
4. Update header component
5. Update authentication screens
6. Update landing screen
7. Test on different mobile devices and emulators

### Phase 4: Special Components
1. Update or replace SVG-based logo components
2. Update animated logo components
3. Verify all logo variations work correctly

## Technical Considerations

### File Format
- Convert the new logo to appropriate formats:
  - PNG for broad compatibility
  - SVG for scalable vector graphics where appropriate
  - Multiple resolutions for different device pixel densities

### Responsive Design
- Ensure the new logo works well at different sizes:
  - Header navigation (small size)
  - Authentication screens (medium size)
  - Landing pages (large size)
  - Mobile interfaces (various sizes)

### Accessibility
- Maintain proper alt text for all logo images
- Ensure adequate contrast for text overlays
- Maintain brand recognition across all implementations

### Performance
- Optimize logo files for web performance
- Use appropriate compression without sacrificing quality
- Implement proper caching headers

## Testing Plan

### Web Application Testing
1. Test logo display on all major browsers (Chrome, Firefox, Safari, Edge)
2. Test responsive behavior on different screen sizes
3. Verify logo quality at different display sizes
4. Check alt text and accessibility features
5. Validate receipt generation with new logo

### Mobile Application Testing
1. Test on both iOS and Android platforms
2. Verify app icon appearance on different device types
3. Check splash screen display
4. Validate logo appearance in all app screens
5. Test different screen densities and resolutions

## Rollback Plan
If issues are discovered after deployment:
1. Restore previous logo files from backup
2. Revert code changes to image source references
3. Redeploy the application with previous logo implementation
4. Investigate and fix issues with new logo
5. Reschedule logo replacement after fixes

## Success Criteria
1. New logo appears consistently across all web pages
2. New logo appears consistently across all mobile screens
3. App icon properly displays the new logo
4. All functionality remains intact
5. No performance degradation
6. All tests pass successfully
