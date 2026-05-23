# Bhutan Connects Feature Documentation

## Overview
Bhutan Connects is a comprehensive hospitality and travel companion matching platform integrated into the Bhutan Explore Connect website. It combines couchsurfing-style hosting with travel buddy matching, specifically designed for Bhutanese cultural context.

## Features

### 1. User Profiles & Authentication
- **Email/Social Login**: Users can sign up with email or Google OAuth
- **Profile Fields**:
  - Basic: name, age, gender (optional), bio, languages, interests
  - Host Profile: hosting toggle, location, space type, max guests, house rules, paid/free status
  - Buddy Profile: companion search toggle, trip details, preferences
- **Verification Levels**: Unverified → Email Verified → ID Verified (with badge display)

### 2. Couchsurfing (Hospitality Exchange)
- **Host Listings**: Searchable by city, dates, verification level
- **Host Cards**: Profile photo, name, verification badge, rating, location, space details
- **Request System**: Travelers send introduction messages; hosts accept/decline
- **Safety Features**: Verification requirements, house rules, cultural guidelines
- **Reviews**: Public references + private feedback after stays

### 3. Travel Buddy Matching
- **Buddy Posts**: Destination, dates, companion preferences, travel style
- **Search & Filter**: By destination, date range, activity type
- **Connection Process**: Send requests → mutual acceptance → messaging
- **Trip Completion**: Optional buddy references for future matching

### 4. Safety & Trust
- **Mandatory Email Verification** before any interactions
- **ID Verification Option** (passport/CID) for enhanced trust
- **Report/Block System** on all profiles and messages
- **Safety Guidelines**: Public meetups, backup plans, cultural respect
- **Bhutan SDF Notice**: Daily $100 fee reminder for international visitors

## Technical Implementation

### Frontend Components
- `BhutanConnectsPage.tsx`: Main feature page with tabs and search
- `UserProfileManager.tsx`: Profile creation and management
- `Messages.tsx`: Request/response messaging system

### Key Technologies
- React with TypeScript
- Framer Motion for animations
- Shadcn/ui components
- Tailwind CSS for styling
- LocalStorage for demo data (replace with API calls)

### API Endpoints (To Be Implemented)

#### Authentication
```javascript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/verify-id
```

#### Profiles
```javascript
GET /api/profile
PUT /api/profile
POST /api/profile/photo
```

#### Hosting
```javascript
GET /api/hosts?city={city}&date={date}&verified={level}
POST /api/hosts/{id}/request
PUT /api/hosts/{id}/request/{requestId}/respond
POST /api/hosts/{id}/review
```

#### Travel Buddies
```javascript
GET /api/buddies?destination={dest}&startDate={date}&activity={type}
POST /api/buddies
POST /api/buddies/{id}/request
PUT /api/buddies/{id}/request/{requestId}/respond
POST /api/buddies/{id}/reference
```

#### Messages
```javascript
GET /api/messages
POST /api/messages/{id}/reply
PUT /api/messages/{id}/read
```

#### Safety
```javascript
POST /api/report?type={profile|message}&id={id}
POST /api/block?userId={id}
```

### Database Schema (Suggested)

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  age INTEGER,
  gender VARCHAR,
  bio TEXT,
  languages JSON,
  interests JSON,
  profile_photo VARCHAR,
  verified_level VARCHAR, -- 'unverified', 'email', 'id'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Hosts Table
```sql
CREATE TABLE hosts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  location VARCHAR,
  space_type VARCHAR,
  max_guests INTEGER,
  house_rules TEXT,
  is_paid BOOLEAN,
  rating DECIMAL,
  review_count INTEGER
);
```

#### Buddy Posts Table
```sql
CREATE TABLE buddy_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  destinations JSON,
  start_date DATE,
  end_date DATE,
  companion_age VARCHAR,
  companion_gender VARCHAR,
  activities JSON,
  travel_style TEXT,
  created_at TIMESTAMP
);
```

#### Requests Table
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  type VARCHAR, -- 'stay' or 'buddy'
  message TEXT,
  status VARCHAR, -- 'pending', 'accepted', 'declined'
  created_at TIMESTAMP
);
```

## Integration Steps

1. **Add Routes**: Routes are already added in `App.tsx`
2. **Update Navigation**: "Connect" link added to navbar
3. **Homepage CTA**: Added call-to-action section
4. **Replace Mock Data**: Replace localStorage with actual API calls
5. **Add Authentication**: Implement login/register flows
6. **File Upload**: Add photo upload functionality
7. **Real-time Messaging**: Consider WebSocket for live chat
8. **Email Notifications**: Send request/response notifications

## Bhutan-Specific Considerations

- **Cultural Sensitivity**: Include house rules about dzong dress codes, tea offerings
- **SDF Awareness**: Display fee information prominently
- **Local Partnerships**: Consider partnerships with licensed homestays
- **Language Support**: Dzongkha alongside English
- **Payment Integration**: For paid homestays (future feature)

## Future Enhancements

- Real-time chat within the platform
- Trip planning tools integration
- Host insurance options
- Advanced matching algorithms
- Mobile app companion
- Multi-language support
- Integration with Bhutan tourism board APIs

## Safety Checklist

- [ ] Email verification required
- [ ] ID verification option available
- [ ] Report/block functionality implemented
- [ ] Safety guidelines displayed
- [ ] Emergency contact information
- [ ] Cultural respect guidelines
- [ ] Terms of service agreement
- [ ] Privacy policy compliance

## Testing Scenarios

1. User registration and profile creation
2. Host listing creation and search
3. Stay request flow (send → accept/decline)
4. Buddy post creation and matching
5. Message threading and responses
6. Review and reference system
7. Report/block functionality
8. Mobile responsiveness
9. Accessibility compliance

---

*This feature promotes authentic cultural exchange while maintaining safety and respect for Bhutanese traditions.*