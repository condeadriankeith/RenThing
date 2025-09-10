"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renAIService = exports.RenAIService = void 0;
var client_1 = require("@prisma/client");
var chat_service_1 = require("@/lib/chat-service");
var ren_feedback_service_1 = require("@/lib/ai/ren-feedback-service");
var prisma = new client_1.PrismaClient();
var RenAIService = /** @class */ (function () {
    function RenAIService() {
        // Add conversation memory storage
        this.conversationMemory = new Map();
        // Define wizards
        this.wizards = {
            listing: {
                steps: [
                    {
                        prompt: "What item would you like to list for rent?",
                        expectedData: "itemName",
                        examples: ["Camera", "Power tools", "Party decorations", "Sports equipment"]
                    },
                    {
                        prompt: "What is the daily rental price for your item?",
                        expectedData: "price",
                        examples: ["₱500", "₱1,200", "₱50"]
                    },
                    {
                        prompt: "Please describe your item in detail. Include condition, features, and any accessories.",
                        expectedData: "description",
                        examples: ["Brand new DSLR camera with 24-70mm lens", "Well-maintained power drill set with 50 pieces"]
                    },
                    {
                        prompt: "Where is your item located? This helps renters find it.",
                        expectedData: "location",
                        examples: ["Makati City", "Quezon City", "Cebu City"]
                    },
                    {
                        prompt: "Would you like to add photos of your item? You can upload them after creating the listing.",
                        expectedData: "photos",
                        options: ["Yes, I'll add photos", "No photos needed"]
                    }
                ],
                totalSteps: 5
            },
            booking: {
                steps: [
                    {
                        prompt: "What item would you like to rent?",
                        expectedData: "itemName",
                        examples: ["Camera", "Power tools", "Party decorations", "Sports equipment"]
                    },
                    {
                        prompt: "When would you like to rent this item?",
                        expectedData: "dates",
                        examples: ["Next week", "This weekend", "Tomorrow to Thursday"]
                    },
                    {
                        prompt: "How long do you need the item for?",
                        expectedData: "duration",
                        examples: ["1 day", "3 days", "1 week", "2 weeks"]
                    },
                    {
                        prompt: "Do you have any special requests or questions for the owner?",
                        expectedData: "requests",
                        examples: ["Need delivery", "Want to know if it comes with accessories", "Flexible on pickup time"]
                    }
                ],
                totalSteps: 4
            }
        };
        this.chatService = new chat_service_1.ChatService();
    }
    /**
     * Get conversation context with memory
     * @param sessionId The session ID
     * @returns The conversation context with memory
     */
    RenAIService.prototype.getConversationContext = function (sessionId) {
        return this.conversationMemory.get(sessionId);
    };
    /**
     * Update conversation context with memory
     * @param sessionId The session ID
     * @param context The updated context
     */
    RenAIService.prototype.updateConversationContext = function (sessionId, context) {
        // Enhance context with conversation memory
        var enhancedContext = this.enhanceContextWithMemory(context);
        this.conversationMemory.set(sessionId, enhancedContext);
    };
    /**
     * Enhance context with conversation memory for better retention
     * @param context The current context
     * @returns Enhanced context with memory
     */
    RenAIService.prototype.enhanceContextWithMemory = function (context) {
        var _a, _b;
        // Initialize remembered preferences if not present
        if (!context.rememberedPreferences) {
            context.rememberedPreferences = {};
        }
        // Initialize remembered entities if not present
        if (!context.rememberedEntities) {
            context.rememberedEntities = {};
        }
        // Remember user preferences across conversations
        if (context.userPreferences) {
            context.rememberedPreferences = __assign(__assign({}, context.rememberedPreferences), context.userPreferences);
        }
        // Remember inferred preferences
        if (context.inferredPreferences) {
            context.rememberedPreferences = __assign(__assign({}, context.rememberedPreferences), { inferred: context.inferredPreferences });
        }
        // Remember entities across conversation turns
        if ((_a = context.userIntent) === null || _a === void 0 ? void 0 : _a.entities) {
            var entities = context.userIntent.entities;
            // Merge with remembered entities
            context.rememberedEntities = {
                items: __spreadArray(__spreadArray([], (context.rememberedEntities.items || []), true), (entities.items || []), true).slice(-5), // Keep last 5 items
                locations: __spreadArray(__spreadArray([], (context.rememberedEntities.locations || []), true), (entities.locations || []), true).slice(-3), // Keep last 3 locations
                dates: __spreadArray(__spreadArray([], (context.rememberedEntities.dates || []), true), (entities.dates || []), true).slice(-3), // Keep last 3 dates
                prices: __spreadArray(__spreadArray([], (context.rememberedEntities.prices || []), true), (entities.prices || []), true).slice(-3), // Keep last 3 prices
                categories: __spreadArray(__spreadArray([], (context.rememberedEntities.categories || []), true), (((_b = context.userPreferences) === null || _b === void 0 ? void 0 : _b.categories) || []), true).slice(-5) // Keep last 5 categories
            };
        }
        // Track conversation topic
        if (context.userIntent) {
            var topic = this.determineConversationTopic(context.userIntent);
            if (topic) {
                context.conversationTopic = {
                    primaryTopic: topic.primary,
                    secondaryTopics: topic.secondary,
                    topicConfidence: topic.confidence,
                    lastMentioned: new Date()
                };
            }
        }
        // Track user goals
        if (context.userIntent && context.userIntent.type !== 'other') {
            // Update or create user goal
            if (!context.userGoal || context.userGoal.type !== context.userIntent.type) {
                context.userGoal = {
                    type: context.userIntent.type,
                    details: context.userIntent.entities || {},
                    progress: 0,
                    createdAt: new Date()
                };
            }
            else {
                // Update existing goal with new information
                context.userGoal.details = __assign(__assign({}, context.userGoal.details), context.userIntent.entities);
                // Increase progress based on new information
                context.userGoal.progress = Math.min(context.userGoal.progress + 10, 100);
            }
        }
        return context;
    };
    /**
     * Determine conversation topic based on user intent
     * @param intent The user intent
     * @returns Topic information
     */
    RenAIService.prototype.determineConversationTopic = function (intent) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var topics = [];
        // Determine primary topic based on intent type
        var primaryTopic = '';
        switch (intent.type) {
            case 'booking':
                primaryTopic = 'rental_booking';
                topics.push('availability', 'dates', 'pricing');
                break;
            case 'listing':
                primaryTopic = 'item_listing';
                topics.push('pricing', 'description', 'photos');
                break;
            case 'search':
                primaryTopic = 'item_search';
                topics.push('categories', 'locations', 'prices');
                break;
            case 'account':
                primaryTopic = 'account_management';
                topics.push('profile', 'settings', 'preferences');
                break;
            case 'payment':
                primaryTopic = 'payment_processing';
                topics.push('billing', 'transactions', 'refunds');
                break;
            case 'support':
                primaryTopic = 'customer_support';
                topics.push('issues', 'help', 'troubleshooting');
                break;
            case 'wishlist':
                primaryTopic = 'wishlist_management';
                topics.push('favorites', 'saved_items', 'notifications');
                break;
            case 'review':
                primaryTopic = 'review_management';
                topics.push('ratings', 'feedback', 'past_rentals');
                break;
            default:
                primaryTopic = 'general';
        }
        // Add topics based on entities
        if ((_b = (_a = intent.entities) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) {
            topics.push.apply(topics, __spreadArray(['items'], intent.entities.items, false));
        }
        if ((_d = (_c = intent.entities) === null || _c === void 0 ? void 0 : _c.locations) === null || _d === void 0 ? void 0 : _d.length) {
            topics.push.apply(topics, __spreadArray(['locations'], intent.entities.locations, false));
        }
        if ((_f = (_e = intent.entities) === null || _e === void 0 ? void 0 : _e.dates) === null || _f === void 0 ? void 0 : _f.length) {
            topics.push('dates', 'scheduling');
        }
        if ((_h = (_g = intent.entities) === null || _g === void 0 ? void 0 : _g.prices) === null || _h === void 0 ? void 0 : _h.length) {
            topics.push('pricing', 'budget');
        }
        // Remove duplicates and limit to 5 secondary topics
        var secondaryTopics = __spreadArray([], new Set(topics), true).filter(function (topic) { return topic !== primaryTopic; }).slice(0, 5);
        return {
            primary: primaryTopic,
            secondary: secondaryTopics,
            confidence: intent.confidence
        };
    };
    /**
     * Get conversation context with enhanced memory
     * @param sessionId The session ID
     * @returns The enhanced conversation context
     */
    RenAIService.prototype.getEnhancedConversationContext = function (sessionId) {
        var context = this.getConversationContext(sessionId);
        if (!context)
            return undefined;
        // Enhance context with remembered information
        var enhancedContext = __assign({}, context);
        // Apply remembered preferences
        if (context.rememberedPreferences) {
            enhancedContext.userPreferences = __assign(__assign({}, enhancedContext.userPreferences), context.rememberedPreferences);
            // Apply inferred preferences if available
            if (context.rememberedPreferences.inferred) {
                enhancedContext.inferredPreferences = __assign(__assign({}, enhancedContext.inferredPreferences), context.rememberedPreferences.inferred);
            }
        }
        // Apply remembered entities
        if (context.rememberedEntities) {
            enhancedContext.rememberedEntities = context.rememberedEntities;
        }
        // Apply conversation topic
        if (context.conversationTopic) {
            enhancedContext.conversationTopic = context.conversationTopic;
        }
        // Apply user goal
        if (context.userGoal) {
            enhancedContext.userGoal = context.userGoal;
        }
        return enhancedContext;
    };
    /**
     * Analyze user sentiment from their message
     * @param message The user's input message
     * @returns Analyzed sentiment with confidence score
     */
    RenAIService.prototype.analyzeSentiment = function (message) {
        var lowerMessage = message.toLowerCase();
        // Define sentiment indicators
        var positiveIndicators = [
            'great', 'awesome', 'excellent', 'wonderful', 'fantastic', 'amazing', 'love', 'like',
            'perfect', 'good', 'nice', 'thank', 'thanks', 'happy', 'pleased', 'satisfied', 'cool'
        ];
        var negativeIndicators = [
            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'angry',
            'frustrated', 'annoyed', 'upset', 'disappointed', 'confused', 'difficult'
        ];
        var frustratedIndicators = [
            'frustrated', 'annoyed', 'upset', 'angry', 'why can\'t', 'doesn\'t work', 'not working',
            'broken', 'stupid', 'useless', 'waste', 'problem', 'issue', 'error', 'failed'
        ];
        var excitedIndicators = [
            'excited', 'thrilled', 'eager', 'can\'t wait', 'looking forward', 'exciting'
        ];
        // Count matches for each sentiment
        var positiveMatches = positiveIndicators.filter(function (indicator) { return lowerMessage.includes(indicator); });
        var negativeMatches = negativeIndicators.filter(function (indicator) { return lowerMessage.includes(indicator); });
        var frustratedMatches = frustratedIndicators.filter(function (indicator) { return lowerMessage.includes(indicator); });
        var excitedMatches = excitedIndicators.filter(function (indicator) { return lowerMessage.includes(indicator); });
        // Determine sentiment based on matches
        var indicators = [];
        var tone = 'neutral';
        var confidence = 0.5;
        if (frustratedMatches.length > 0) {
            tone = 'frustrated';
            confidence = Math.min(0.5 + (frustratedMatches.length * 0.2), 1.0);
            indicators.push.apply(indicators, frustratedMatches);
        }
        else if (excitedMatches.length > 0) {
            tone = 'excited';
            confidence = Math.min(0.5 + (excitedMatches.length * 0.2), 1.0);
            indicators.push.apply(indicators, excitedMatches);
        }
        else if (positiveMatches.length > negativeMatches.length) {
            tone = 'positive';
            confidence = Math.min(0.5 + ((positiveMatches.length - negativeMatches.length) * 0.1), 1.0);
            indicators.push.apply(indicators, positiveMatches);
        }
        else if (negativeMatches.length > positiveMatches.length) {
            tone = 'negative';
            confidence = Math.min(0.5 + ((negativeMatches.length - positiveMatches.length) * 0.1), 1.0);
            indicators.push.apply(indicators, negativeMatches);
        }
        else if (positiveMatches.length > 0) {
            tone = 'positive';
            confidence = 0.6;
            indicators.push.apply(indicators, positiveMatches);
        }
        else if (negativeMatches.length > 0) {
            tone = 'negative';
            confidence = 0.6;
            indicators.push.apply(indicators, negativeMatches);
        }
        return {
            tone: tone,
            confidence: confidence,
            indicators: __spreadArray([], new Set(indicators), true) // Remove duplicates
        };
    };
    /**
     * Classify user intent from their message with enhanced sophistication
     * @param message The user's input message
     * @returns Classified intent with confidence score
     */
    RenAIService.prototype.classifyIntent = function (message) {
        var lowerMessage = message.toLowerCase();
        // Add greeting detection
        var greetingPatterns = [
            'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
            'greetings', 'howdy', 'what\'s up', 'how are you'
        ];
        var isGreeting = greetingPatterns.some(function (pattern) { return lowerMessage.includes(pattern); });
        if (isGreeting) {
            return {
                type: 'greeting',
                confidence: 0.9,
                entities: undefined
            };
        }
        // Enhanced intent patterns with more sophisticated matching
        var bookingPatterns = [
            'book', 'rent', 'reserve', 'availability', 'dates', 'calendar',
            'when can i', 'can i rent', 'i want to rent', 'i need to rent',
            'rental period', 'pickup', 'drop off', 'delivery', 'return',
            'schedule', 'time slot', 'booking confirmation', 'reservation'
        ];
        var listingPatterns = [
            'list', 'sell', 'offer', 'rent out', 'put up', 'post',
            'how to list', 'create listing', 'add item', 'my items',
            'rent my', 'share my', 'make available', 'publish',
            'item details', 'rental price', 'daily rate', 'pricing',
            'availability calendar', 'rental terms', 'description',
            'photos', 'images', 'condition', 'accessories'
        ];
        var searchPatterns = [
            'find', 'search', 'look for', 'want', 'need', 'show me',
            'looking for', 'where can i', 'any', 'have', 'available',
            'browse', 'explore', 'see', 'check', 'view', 'display',
            'filter', 'sort', 'category', 'type', 'kind', 'range',
            'budget', 'price range', 'under', 'less than', 'affordable'
        ];
        var accountPatterns = [
            'profile', 'account', 'settings', 'update', 'change',
            'my info', 'personal', 'preferences', 'password',
            'username', 'email', 'phone', 'address', 'location',
            'notification', 'privacy', 'security', 'delete account',
            'close account', 'deactivate', 'login', 'logout', 'sign in',
            'sign up', 'register', 'forgot password', 'reset password'
        ];
        var paymentPatterns = [
            'pay', 'payment', 'price', 'cost', 'fee', 'charge',
            'how much', 'bill', 'invoice', 'refund', 'transaction',
            'credit card', 'debit card', 'gcash', 'paypal', 'bank transfer',
            'payment method', 'billing', 'checkout', 'complete payment',
            'payment status', 'failed payment', 'payment confirmation'
        ];
        var supportPatterns = [
            'help', 'support', 'problem', 'issue', 'broken', 'not working',
            'contact', 'assistance', 'question', 'how to', 'trouble',
            'error', 'bug', 'glitch', 'malfunction', 'complaint',
            'feedback', 'suggestion', 'report', 'compliment', 'praise'
        ];
        var wishlistPatterns = [
            'wishlist', 'favorite', 'save for later', 'bookmark',
            'add to wishlist', 'remove from wishlist', 'my wishlist',
            'saved items', 'interested in', 'want to rent later'
        ];
        var reviewPatterns = [
            'review', 'rating', 'rate', 'feedback', 'comment',
            'leave review', 'submit rating', 'my reviews',
            'previous rentals', 'past bookings', 'experience'
        ];
        // Count matches for each intent with weighted scoring
        var intentScores = {
            booking: this.calculatePatternScore(lowerMessage, bookingPatterns),
            listing: this.calculatePatternScore(lowerMessage, listingPatterns),
            search: this.calculatePatternScore(lowerMessage, searchPatterns),
            account: this.calculatePatternScore(lowerMessage, accountPatterns),
            payment: this.calculatePatternScore(lowerMessage, paymentPatterns),
            support: this.calculatePatternScore(lowerMessage, supportPatterns),
            wishlist: this.calculatePatternScore(lowerMessage, wishlistPatterns),
            review: this.calculatePatternScore(lowerMessage, reviewPatterns)
        };
        // Find the intent with the highest score
        var intentEntries = Object.entries(intentScores);
        var _a = intentEntries.reduce(function (max, entry) { return entry[1] > max[1] ? entry : max; }, ['', 0]), topIntent = _a[0], score = _a[1];
        // Extract entities
        var entities = this.extractEntities(message);
        // If no clear intent, classify as 'other'
        var intentType = score > 0 ? topIntent : 'other';
        var confidence = score > 0 ? Math.min(score / 5, 1) : 0.3;
        return {
            type: intentType,
            confidence: confidence,
            entities: entities
        };
    };
    /**
     * Calculate pattern matching score with sophisticated weighting
     * @param message The user's input message
     * @param patterns Array of patterns to match
     * @returns Weighted score
     */
    RenAIService.prototype.calculatePatternScore = function (message, patterns) {
        var score = 0;
        // Exact matches get higher weight
        patterns.forEach(function (pattern) {
            if (message.includes(pattern)) {
                // Longer patterns are more specific and get higher weight
                score += pattern.split(' ').length;
            }
        });
        return score;
    };
    /**
     * Extract entities from user message with enhanced sophistication
     * @param message The user's input message
     * @returns Extracted entities
     */
    RenAIService.prototype.extractEntities = function (message) {
        var entities = {};
        // Extract potential items with enhanced pattern matching
        var itemPattern = /\b(camera|lens|tripod|drone|tool|equipment|bike|car|vehicle|dress|clothes|party|decoration|speaker|sound|light|projector|tent|camping|sports|game|toy|furniture|chair|table|monitor|computer|laptop|phone|tablet|book|instrument|music|art|paint|brush|vacuum|cleaner|kitchen|cook|bake|garden|plant|pet|baby|child|kid|sports|fitness|health|medical|office|work|study|school|education|wedding|event|celebration|holiday|christmas|valentine|halloween|new year|backpack|bag|purse|jewelry|watch|shoes|boots|sandals|hat|cap|sunglasses|gloves|scarf|coat|jacket|shirt|pants|jeans|shorts|skirt|dress|suit|tie|belt|socks|underwear|swimsuit|costume|uniform|accessories|appliances|electronics|gadgets|devices|machines|utensils|cookware|bakeware|linens|bedding|towels|blankets|pillows|cushions|curtains|blinds|rugs|carpets|mirrors|frames|clocks|vases|ornaments|collectibles|antiques|vintage|handmade|crafts|diy|materials|supplies|tools|hardware|fixtures|plumbing|electrical|painting|decor|ornament|statue|figure|doll|action figure|board game|card game|puzzle|toy|sports equipment|fitness equipment|exercise|workout|yoga|pilates|dance|music|karaoke|dj|recording|studio|lighting|photography|video|film|movie|tv|television|streaming|gaming|console|vr|ar|augmented reality|virtual reality|smart home|automation|security|safety|first aid|medical|health|beauty|cosmetics|skincare|haircare|nail|makeup|fragrance|perfume|cleaning|laundry|storage|organization|moving|packing|travel|luggage|backpack|camping|outdoor|garden|lawn|yard|patio|deck|porch|balcony|terrace|roof|garage|shed|workshop|basement|attic|crawl space|closet|wardrobe|pantry|cellar|wine|bar|kitchen|dining|living|family|bed|bath|powder|guest|study|office|den|library|playroom|game|media|theater|home|theater|entertainment|utility|laundry|mechanic|tool|shed|greenhouse|playhouse|gazebo|pergola|fountain|pond|water|feature|fire|pit|bbq|grill|outdoor|kitchen|patio|furniture|umbrella|awning|canopy|tent|awning|carport|garage|door|window|shutter|blind|curtain|drape|valance|swag|cornice|rod|pole|track|hardware|handle|knob|lock|latch|hinge|catch|strike|plate|escutcheon|strike|plate|threshold|sill|frame|jamb|header|sash|glazing|weatherstripping|seal|caulk|insulation|weatherization|ventilation|fan|heater|air|conditioner|heat|pump|boiler|furnace|radiator|baseboard|space|heater|fireplace|stove|oven|range|cooktop|microwave|refrigerator|freezer|dishwasher|washer|dryer|garbage|disposal|water|heater|softener|filter|purifier|humidifier|dehumidifier|generator|solar|panel|battery|inverter|charger|transformer|converter|adapter|plug|outlet|switch|dimmer|timer|sensor|detector|alarm|intercom|doorbell|camera|monitor|recorder|nvr|dvr|router|modem|network|wireless|wifi|bluetooth|ethernet|cable|wire|cord|extension|surge|protector|power|strip|battery|charger|inverter|solar|panel|generator|light|lamp|fixture|bulb|led|fluorescent|incandescent|halogen|cfl|smart|bulb|motion|sensor|daylight|sensor|timer|dimmer|switch|outdoor|lighting|landscape|lighting|path|light|step|light|wall|light|ceiling|light|pendant|light|chandelier|sconce|track|lighting|under|cabinet|lighting|night|light|emergency|light|exit|sign|security|light|flood|light|spotlight|work|light|task|light|reading|light|desk|lamp|table|lamp|floor|lamp|torchiere|arc|lamp|accent|light|decorative|light|novelty|light|holiday|light|christmas|light|halloween|light|valentine|light|easter|light|thanksgiving|light|independence|day|light|new|year|light|birthday|light|anniversary|light|wedding|light|graduation|light|baby|shower|light|bridal|shower|light|engagement|party|light|engagement|ring|light|diamond|light|gemstone|light|crystal|light|glass|light|metal|light|wood|light|plastic|light|fabric|light|paper|light|cardboard|light|foam|light|rubber|light|silicone|light|vinyl|light|pvc|light|abs|light|pc|light|pp|light|pe|light|ps|light|pet|light|plant|light|aquarium|light|terrarium|light|vivarium|light|reptile|light|amphibian|light|insect|light|arachnid|light|crustacean|light|mollusk|light|fish|light|bird|light|mammal|light|reptile|light|amphibian|light|insect|light|arachnid|light|crustacean|light|mollusk|light|fish|light|bird|light|mammal)\b/gi;
        var items = message.match(itemPattern);
        if (items) {
            entities.items = __spreadArray([], new Set(items.map(function (item) { return item.toLowerCase(); })), true);
        }
        // Extract potential dates with enhanced pattern matching
        var datePattern = /\b(today|tomorrow|yesterday|next week|this week|next month|this month|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}[\/\-]\d{1,2}|\d{1,2}(st|nd|rd|th)|january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|weekday)\b/gi;
        var dates = message.match(datePattern);
        if (dates) {
            entities.dates = __spreadArray([], new Set(dates.map(function (date) { return date.toLowerCase(); })), true);
        }
        // Extract potential locations (Philippine cities/regions) with enhanced pattern matching
        var locationPattern = /\b(manila|makati|quezon|taguig|pasay|mandaluyong|san juan|caloocan|pasig|marikina|parañaque|las piñas|cebu|davao|iloilo|bacolod|cagayan|bohol|pangasinan|laguna|rizal|bulacan|pampanga|tarlac|bataan|zambales|batangas|cavite|mindoro|palawan|aklan|samar|leyte|tacloban|cagayan|isabela|nueva|bataan|zambales|mindoro|aklan|samar|leyte|tacloban|cagayan|isabela|nueva|ecija|bataan|pampanga|tarlac|zambales|batangas|cavite|oriental mindoro|occidental mindoro|norte|sur|davao|del|norte|davao|del|sur|davao|occidental|davao|oriental|compostela|valley|south|cotabato|sarangani|general|santos|sultan|kudarat|north|cotabato|south|cotabato|agusan|del|norte|agusan|del|sur|surigao|del|norte|surigao|del|sur|dinagat|islands|biliran|eastern|samar|northern|samar|southern|leyte|quezon|polillo|islands|romblon|marinduque|masbate|sorsogon|albay|camarines|norte|camarines|sur|catanduanes|quezon|bataan|bulacan|nueva|ecija|pampanga|tarlac|zambales|batangas|cavite|laguna|quezon|rizal|metro|manila|calabarzon|region|iv-a|mimaropa|region|iv-b|bicol|region|v|cordillera|car|region|ii|region|iii|region|vii|region|viii|region|ix|region|x|region|xi|region|xii|region|xiii|armm|ncr|caraga|davao|region|region|iv-a|region|iv-b)\b/gi;
        var locations = message.match(locationPattern);
        if (locations) {
            entities.locations = __spreadArray([], new Set(locations.map(function (location) { return location.toLowerCase(); })), true);
        }
        // Extract potential prices with enhanced pattern matching
        var pricePattern = /(?:₱|\bphp\b|\$)?\s*(\d+(?:\.\d{2})?)\b/gi;
        var prices = message.match(pricePattern);
        if (prices) {
            entities.prices = prices.map(function (price) {
                var cleanPrice = price.replace(/[₱$php]/gi, '').trim();
                return parseFloat(cleanPrice);
            }).filter(function (price) { return !isNaN(price); });
        }
        // Extract potential durations
        var durationPattern = /\b(\d+\s*(day|days|week|weeks|month|months|hour|hours))\b/gi;
        var durations = message.match(durationPattern);
        if (durations) {
            entities.durations = __spreadArray([], new Set(durations.map(function (duration) { return duration.toLowerCase(); })), true);
        }
        return Object.keys(entities).length > 0 ? entities : undefined;
    };
    /**
     * Handle ambiguous queries by asking clarifying questions with enhanced sophistication
     * @param message The user's input message
     * @param context The conversation context
     * @returns Clarification response if needed, otherwise null
     */
    RenAIService.prototype.handleAmbiguousQuery = function (message, context) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var lowerMessage = message.toLowerCase();
        // Check if we need clarification based on intent confidence
        if (context.userIntent && context.userIntent.confidence < 0.5) {
            // Set clarification flag in conversation state
            if (!context.conversationState) {
                context.conversationState = {};
            }
            context.conversationState.clarificationNeeded = true;
            // Ask clarifying question based on potential entities
            if ((_b = (_a = context.userIntent.entities) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) {
                return {
                    text: "I'm not sure exactly what you're looking for. Did you mean to search for ".concat(context.userIntent.entities.items[0], " rentals?"),
                    suggestions: ["Yes, search for ".concat(context.userIntent.entities.items[0]), "No, let me rephrase", "Show me all categories"]
                };
            }
            if ((_d = (_c = context.userIntent.entities) === null || _c === void 0 ? void 0 : _c.locations) === null || _d === void 0 ? void 0 : _d.length) {
                return {
                    text: "I noticed you mentioned ".concat(context.userIntent.entities.locations[0], ". Are you looking for rentals in that area?"),
                    suggestions: ["Yes, in ".concat(context.userIntent.entities.locations[0]), "No, anywhere", "Show me nearby locations"]
                };
            }
            if ((_f = (_e = context.userIntent.entities) === null || _e === void 0 ? void 0 : _e.dates) === null || _f === void 0 ? void 0 : _f.length) {
                return {
                    text: "I see you mentioned ".concat(context.userIntent.entities.dates[0], ". Are you looking to rent something for that date?"),
                    suggestions: ["Yes, find rentals for ".concat(context.userIntent.entities.dates[0]), "No, let me rephrase", "Show me available dates"]
                };
            }
            if ((_h = (_g = context.userIntent.entities) === null || _g === void 0 ? void 0 : _g.prices) === null || _h === void 0 ? void 0 : _h.length) {
                var price = context.userIntent.entities.prices[0];
                return {
                    text: "I noticed you mentioned \u20B1".concat(price, ". Are you looking for rentals within that price range?"),
                    suggestions: ["Yes, show me rentals around \u20B1".concat(price), "No, let me rephrase", "Show me all price ranges"]
                };
            }
            // Enhanced generic clarification with context-aware suggestions
            var suggestions = this.generateContextualClarificationSuggestions(context);
            return {
                text: "I'm not quite sure what you're asking for. Could you provide more details about what you need?",
                suggestions: suggestions
            };
        }
        // Additional ambiguity detection based on message content
        if (this.isMessageAmbiguous(lowerMessage, context)) {
            // Set clarification flag in conversation state
            if (!context.conversationState) {
                context.conversationState = {};
            }
            context.conversationState.clarificationNeeded = true;
            // Generate context-aware clarification
            var clarification = this.generateAmbiguityClarification(lowerMessage, context);
            return clarification;
        }
        return null;
    };
    /**
     * Generate contextual clarification suggestions based on user context
     * @param context The conversation context
     * @returns Array of contextual suggestions
     */
    RenAIService.prototype.generateContextualClarificationSuggestions = function (context) {
        var _a, _b, _c, _d;
        var suggestions = [];
        // Add suggestions based on user history
        if ((_b = (_a = context.inferredPreferences) === null || _a === void 0 ? void 0 : _a.preferredCategories) === null || _b === void 0 ? void 0 : _b.length) {
            suggestions.push("I'm looking for ".concat(context.inferredPreferences.preferredCategories[0], " rentals"));
        }
        if ((_d = (_c = context.inferredPreferences) === null || _c === void 0 ? void 0 : _c.preferredLocations) === null || _d === void 0 ? void 0 : _d.length) {
            suggestions.push("Find rentals in ".concat(context.inferredPreferences.preferredLocations[0]));
        }
        // Add general suggestions
        suggestions.push("I want to rent something");
        suggestions.push("I want to list an item");
        suggestions.push("I need help with my account");
        suggestions.push("Never mind");
        // Limit to 4 suggestions
        return suggestions.slice(0, 4);
    };
    /**
     * Detect if a message is ambiguous based on content and context
     * @param message The user's input message
     * @param context The conversation context
     * @returns Whether the message is ambiguous
     */
    RenAIService.prototype.isMessageAmbiguous = function (message, context) {
        var _a, _b, _c, _d, _e;
        // Check for vague terms that need clarification
        var vagueTerms = [
            'something', 'anything', 'stuff', 'things', 'item', 'it', 'this', 'that',
            'some', 'any', 'one', 'few', 'many', 'lot', 'several', 'various'
        ];
        // Check if message contains vague terms without specific entities
        var hasVagueTerms = vagueTerms.some(function (term) { return message.includes(term); });
        var hasEntities = ((_a = context.userIntent) === null || _a === void 0 ? void 0 : _a.entities) &&
            (((_b = context.userIntent.entities.items) === null || _b === void 0 ? void 0 : _b.length) ||
                ((_c = context.userIntent.entities.locations) === null || _c === void 0 ? void 0 : _c.length) ||
                ((_d = context.userIntent.entities.dates) === null || _d === void 0 ? void 0 : _d.length) ||
                ((_e = context.userIntent.entities.prices) === null || _e === void 0 ? void 0 : _e.length));
        // Message is ambiguous if it has vague terms but no specific entities
        if (hasVagueTerms && !hasEntities) {
            return true;
        }
        // Check for incomplete requests
        var incompletePatterns = [
            'i need', 'i want', 'looking for', 'find me', 'show me',
            'can you', 'could you', 'would you', 'help me'
        ];
        var isIncompleteRequest = incompletePatterns.some(function (pattern) {
            return message.startsWith(pattern) && message.split(' ').length < 4;
        });
        return isIncompleteRequest;
    };
    /**
     * Generate clarification for ambiguous messages
     * @param message The user's input message
     * @param context The conversation context
     * @returns Clarification response
     */
    RenAIService.prototype.generateAmbiguityClarification = function (message, context) {
        // Check for common ambiguous patterns
        if (message.includes('something')) {
            return {
                text: "You mentioned 'something' - could you be more specific about what type of item you're looking for?",
                suggestions: [
                    "I'm looking for tools",
                    "I need party supplies",
                    "I want sports equipment",
                    "Show me popular categories"
                ]
            };
        }
        if (message.includes('anything')) {
            return {
                text: "You mentioned 'anything' - what category of items are you interested in?",
                suggestions: [
                    "Show me all categories",
                    "I'm looking for electronics",
                    "I need home appliances",
                    "I want outdoor equipment"
                ]
            };
        }
        // For incomplete requests
        if (message.startsWith('i need') || message.startsWith('i want')) {
            return {
                text: "Could you provide more details about what you need?",
                suggestions: [
                    "I need it for a party",
                    "I want something for outdoor use",
                    "I need it this weekend",
                    "I'm looking for affordable options"
                ]
            };
        }
        // Generic clarification
        return {
            text: "I'd like to help you better. Could you provide more specific details about what you're looking for?",
            suggestions: [
                "I'm looking for a specific item",
                "I need something for a specific date",
                "I want items in a specific location",
                "I have a specific budget in mind"
            ]
        };
    };
    /**
     * Adapt response tone based on user sentiment
     * @param response The AI response to adapt
     * @param sentiment The user's sentiment
     * @returns Adapted response
     */
    RenAIService.prototype.adaptResponseToSentiment = function (response, sentiment) {
        // Create a copy of the response to modify
        var adaptedResponse = __assign({}, response);
        // Adapt tone based on user sentiment
        switch (sentiment.tone) {
            case 'frustrated':
                // Add empathetic language
                adaptedResponse.text = "I understand this might be frustrating. ".concat(adaptedResponse.text);
                // Add support suggestions
                if (adaptedResponse.suggestions) {
                    adaptedResponse.suggestions = __spreadArray(__spreadArray([], adaptedResponse.suggestions, true), ["Contact support"], false);
                }
                else {
                    adaptedResponse.suggestions = ["Contact support"];
                }
                break;
            case 'excited':
                // Add enthusiastic language
                adaptedResponse.text = "That's great to hear! ".concat(adaptedResponse.text);
                break;
            case 'negative':
                // Add reassuring language
                adaptedResponse.text = "I'm sorry to hear that. ".concat(adaptedResponse.text);
                break;
            case 'positive':
                // Add positive reinforcement
                adaptedResponse.text = "That's wonderful! ".concat(adaptedResponse.text);
                break;
        }
        return adaptedResponse;
    };
    /**
     * Determine if we should escalate to human support
     * @param context The conversation context
     * @returns Whether to escalate and reason
     */
    RenAIService.prototype.shouldEscalateToHuman = function (context) {
        var _a, _b, _c, _d;
        // Escalate if user is frustrated and we've failed to help
        if (((_a = context.userSentiment) === null || _a === void 0 ? void 0 : _a.tone) === 'frustrated' && context.userSentiment.confidence > 0.7) {
            return {
                shouldEscalate: true,
                reason: "User appears frustrated with the service"
            };
        }
        // Escalate if user explicitly requests human support
        if (context.conversationHistory) {
            var lastUserMessage = context.conversationHistory.findLast(function (msg) { return msg.role === 'user'; });
            if (lastUserMessage) {
                var lowerMessage_1 = lastUserMessage.content.toLowerCase();
                var humanSupportKeywords = [
                    'human', 'person', 'agent', 'representative', 'customer service',
                    'talk to a person', 'speak to someone', 'real person'
                ];
                var hasKeyword = humanSupportKeywords.some(function (keyword) { return lowerMessage_1.includes(keyword); });
                if (hasKeyword) {
                    return {
                        shouldEscalate: true,
                        reason: "User explicitly requested human support"
                    };
                }
            }
        }
        // Escalate if we've been going in circles (multiple clarification attempts)
        if ((_b = context.conversationState) === null || _b === void 0 ? void 0 : _b.clarificationNeeded) {
            // Count clarification attempts in conversation history
            var clarificationCount = 0;
            if (context.conversationHistory) {
                for (var i = context.conversationHistory.length - 1; i >= 0; i--) {
                    var msg = context.conversationHistory[i];
                    if (msg.role === 'assistant' && msg.content.includes('I\'m not quite sure')) {
                        clarificationCount++;
                    }
                    // Only look at recent messages (last 5 turns)
                    if (context.conversationHistory.length - i > 5)
                        break;
                }
            }
            if (clarificationCount > 2) {
                return {
                    shouldEscalate: true,
                    reason: "Unable to understand user request after multiple attempts"
                };
            }
        }
        // Escalate for complex account issues
        if (((_c = context.userIntent) === null || _c === void 0 ? void 0 : _c.type) === 'account' && context.userIntent.confidence > 0.8) {
            // Check for complex account issues
            var lastUserMessage = (_d = context.conversationHistory) === null || _d === void 0 ? void 0 : _d.findLast(function (msg) { return msg.role === 'user'; });
            if (lastUserMessage) {
                var lowerMessage_2 = lastUserMessage.content.toLowerCase();
                var complexAccountIssues = [
                    'deleted', 'suspended', 'banned', 'verification', 'id', 'document',
                    'account locked', 'can\'t access', 'reset password', 'security'
                ];
                var hasComplexIssue = complexAccountIssues.some(function (issue) { return lowerMessage_2.includes(issue); });
                if (hasComplexIssue) {
                    return {
                        shouldEscalate: true,
                        reason: "Complex account issue requiring human intervention"
                    };
                }
            }
        }
        return { shouldEscalate: false };
    };
    /**
     * Process a user message using the DeepSeek-R1 model
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response
     */
    RenAIService.prototype.processMessage = function (message, context) {
        return __awaiter(this, void 0, void 0, function () {
            var memoryContext, userPreferences, sentiment, intent, wizardResponse, lowerMessage, wizardResponse, wizardResponse, escalation, response, clarificationResponse, adaptedResponse_1, deepSeekResponse, adaptedResponse_2, error_1, ollamaResponse, adaptedResponse_3, error_2, ruleBasedResponse, adaptedResponse;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Get conversation context from memory if available
                        if (context.sessionId) {
                            memoryContext = this.getConversationContext(context.sessionId);
                            if (memoryContext) {
                                // Merge memory context with current context, prioritizing current context
                                context = __assign(__assign({}, memoryContext), context);
                            }
                        }
                        if (!context.userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserPreferences(context.userId)];
                    case 1:
                        userPreferences = _c.sent();
                        if (userPreferences) {
                            context.inferredPreferences = userPreferences;
                        }
                        _c.label = 2;
                    case 2:
                        sentiment = this.analyzeSentiment(message);
                        context.userSentiment = sentiment;
                        intent = this.classifyIntent(message);
                        context.userIntent = intent;
                        // Check if we're in a wizard flow
                        if ((_a = context.conversationState) === null || _a === void 0 ? void 0 : _a.wizard) {
                            wizardResponse = this.processWizardStep(message, context);
                            if (wizardResponse) {
                                // Save updated context to memory
                                if (context.sessionId) {
                                    this.updateConversationContext(context.sessionId, context);
                                }
                                return [2 /*return*/, wizardResponse];
                            }
                        }
                        lowerMessage = message.toLowerCase();
                        if (lowerMessage.includes('list an item') || lowerMessage.includes('create listing') ||
                            (intent.type === 'listing' && intent.confidence > 0.7)) {
                            wizardResponse = this.startWizard('listing', context);
                            // Save updated context to memory
                            if (context.sessionId) {
                                this.updateConversationContext(context.sessionId, context);
                            }
                            return [2 /*return*/, wizardResponse];
                        }
                        if (lowerMessage.includes('book') || lowerMessage.includes('rent') ||
                            (intent.type === 'booking' && intent.confidence > 0.7)) {
                            wizardResponse = this.startWizard('booking', context);
                            // Save updated context to memory
                            if (context.sessionId) {
                                this.updateConversationContext(context.sessionId, context);
                            }
                            return [2 /*return*/, wizardResponse];
                        }
                        escalation = this.shouldEscalateToHuman(context);
                        if (!escalation.shouldEscalate) return [3 /*break*/, 4];
                        response = {
                            text: "I understand you're having difficulty. Let me connect you with a human support agent who can better assist you with ".concat(((_b = escalation.reason) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || 'your request', "."),
                            suggestions: ["Connect to support", "Continue with AI assistant", "Go back"],
                            action: { type: "escalate_to_human", payload: { reason: escalation.reason } }
                        };
                        // Log the interaction for self-improvement
                        return [4 /*yield*/, this.logInteraction(message, response, context)];
                    case 3:
                        // Log the interaction for self-improvement
                        _c.sent();
                        // Save updated context to memory
                        if (context.sessionId) {
                            this.updateConversationContext(context.sessionId, context);
                        }
                        return [2 /*return*/, response];
                    case 4:
                        clarificationResponse = this.handleAmbiguousQuery(message, context);
                        if (clarificationResponse) {
                            adaptedResponse_1 = this.adaptResponseToSentiment(clarificationResponse, sentiment);
                            // Save updated context to memory
                            if (context.sessionId) {
                                this.updateConversationContext(context.sessionId, context);
                            }
                            return [2 /*return*/, adaptedResponse_1];
                        }
                        // Update conversation state
                        if (context.conversationState) {
                            context.conversationState.lastIntent = intent;
                            // Reset clarification flag
                            context.conversationState.clarificationNeeded = false;
                        }
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 9, , 10]);
                        return [4 /*yield*/, this.processWithOpenRouter(message, context)];
                    case 6:
                        deepSeekResponse = _c.sent();
                        if (!deepSeekResponse) return [3 /*break*/, 8];
                        adaptedResponse_2 = this.adaptResponseToSentiment(deepSeekResponse, sentiment);
                        // Log the interaction for self-improvement
                        return [4 /*yield*/, this.logInteraction(message, adaptedResponse_2, context)];
                    case 7:
                        // Log the interaction for self-improvement
                        _c.sent();
                        // Save updated context to memory
                        if (context.sessionId) {
                            this.updateConversationContext(context.sessionId, context);
                        }
                        return [2 /*return*/, adaptedResponse_2];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _c.sent();
                        console.warn('DeepSeek model failed, falling back to Ollama:', error_1);
                        return [3 /*break*/, 10];
                    case 10:
                        _c.trys.push([10, 14, , 15]);
                        return [4 /*yield*/, this.processWithOllama(message, context)];
                    case 11:
                        ollamaResponse = _c.sent();
                        if (!ollamaResponse) return [3 /*break*/, 13];
                        adaptedResponse_3 = this.adaptResponseToSentiment(ollamaResponse, sentiment);
                        // Log the interaction for self-improvement
                        return [4 /*yield*/, this.logInteraction(message, adaptedResponse_3, context)];
                    case 12:
                        // Log the interaction for self-improvement
                        _c.sent();
                        // Save updated context to memory
                        if (context.sessionId) {
                            this.updateConversationContext(context.sessionId, context);
                        }
                        return [2 /*return*/, adaptedResponse_3];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_2 = _c.sent();
                        console.warn('Ollama model failed, falling back to rule-based system:', error_2);
                        return [3 /*break*/, 15];
                    case 15: return [4 /*yield*/, this.processMessageRuleBased(message, context)];
                    case 16:
                        ruleBasedResponse = _c.sent();
                        adaptedResponse = this.adaptResponseToSentiment(ruleBasedResponse, sentiment);
                        // Log the interaction for self-improvement
                        return [4 /*yield*/, this.logInteraction(message, adaptedResponse, context)];
                    case 17:
                        // Log the interaction for self-improvement
                        _c.sent();
                        // Save updated context to memory
                        if (context.sessionId) {
                            this.updateConversationContext(context.sessionId, context);
                        }
                        return [2 /*return*/, adaptedResponse];
                }
            });
        });
    };
    /**
     * Process a user message using rule-based responses (fallback)
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response
     */
    RenAIService.prototype.processMessageRuleBased = function (message, context) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerMessage, bookingSuggestions, listingSuggestions, searchSuggestions, defaultSuggestions;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                lowerMessage = message.toLowerCase();
                // Handle clarification responses
                if ((_a = context.conversationState) === null || _a === void 0 ? void 0 : _a.clarificationNeeded) {
                    // Reset clarification flag
                    context.conversationState.clarificationNeeded = false;
                    // Handle user responses to clarification
                    if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sure')) {
                        // User confirmed, proceed with last intent
                        if (context.conversationState.lastIntent) {
                            context.userIntent = context.conversationState.lastIntent;
                        }
                    }
                    else if (lowerMessage.includes('no') || lowerMessage.includes('nope') || lowerMessage.includes('never mind')) {
                        return [2 /*return*/, {
                                text: "Okay, let's start over. How can I help you today?",
                                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
                            }];
                    }
                }
                // Handle user intent
                if (context.userIntent) {
                    switch (context.userIntent.type) {
                        case 'greeting':
                            return [2 /*return*/, {
                                    text: "Hello! I'm REN, your rental marketplace assistant. I can help you find items to rent, list your own items, manage bookings, and more. How can I assist you today?",
                                    suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
                                }];
                        case 'booking':
                            bookingSuggestions = ["Camera", "Power tools", "Party decorations", "Sports equipment"];
                            if ((_c = (_b = context.inferredPreferences) === null || _b === void 0 ? void 0 : _b.preferredCategories) === null || _c === void 0 ? void 0 : _c.length) {
                                bookingSuggestions = [
                                    context.inferredPreferences.preferredCategories[0],
                                    context.inferredPreferences.preferredCategories[1] || "Power tools",
                                    "Party decorations",
                                    "Sports equipment"
                                ];
                            }
                            return [2 /*return*/, {
                                    text: "Sure, I can help you with that. What item would you like to rent?",
                                    suggestions: bookingSuggestions
                                }];
                        case 'listing':
                            listingSuggestions = ["Camera", "Power tools", "Party decorations", "Sports equipment"];
                            if ((_e = (_d = context.inferredPreferences) === null || _d === void 0 ? void 0 : _d.preferredCategories) === null || _e === void 0 ? void 0 : _e.length) {
                                listingSuggestions = [
                                    context.inferredPreferences.preferredCategories[0],
                                    context.inferredPreferences.preferredCategories[1] || "Power tools",
                                    "Party decorations",
                                    "Sports equipment"
                                ];
                            }
                            return [2 /*return*/, {
                                    text: "Great! What item would you like to list for rent?",
                                    suggestions: listingSuggestions
                                }];
                        case 'search':
                            searchSuggestions = ["Camera", "Power tools", "Party decorations", "Sports equipment"];
                            if ((_g = (_f = context.inferredPreferences) === null || _f === void 0 ? void 0 : _f.preferredCategories) === null || _g === void 0 ? void 0 : _g.length) {
                                searchSuggestions = [
                                    context.inferredPreferences.preferredCategories[0],
                                    context.inferredPreferences.preferredCategories[1] || "Power tools",
                                    "Party decorations",
                                    "Sports equipment"
                                ];
                            }
                            return [2 /*return*/, {
                                    text: "Sure, what are you looking for?",
                                    suggestions: searchSuggestions
                                }];
                        case 'account':
                            return [2 /*return*/, {
                                    text: "Sure, what would you like to do with your account?",
                                    suggestions: ["Update profile", "Change password", "View rental history"]
                                }];
                        case 'payment':
                            return [2 /*return*/, {
                                    text: "Sure, what payment-related information do you need?",
                                    suggestions: ["View balance", "Add payment method", "Check transaction history"]
                                }];
                        case 'support':
                            return [2 /*return*/, {
                                    text: "Sure, how can I assist you?",
                                    suggestions: ["Report an issue", "Request a feature", "Contact support"]
                                }];
                        case 'other':
                            return [2 /*return*/, {
                                    text: "I'm not sure what you're asking for. Could you provide more details?",
                                    suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
                                }];
                    }
                }
                defaultSuggestions = ["Find rentals", "List items", "Check bookings", "View wishlist"];
                if ((_j = (_h = context.inferredPreferences) === null || _h === void 0 ? void 0 : _h.preferredCategories) === null || _j === void 0 ? void 0 : _j.length) {
                    defaultSuggestions = [
                        "Find ".concat(context.inferredPreferences.preferredCategories[0], " rentals"),
                        "List items",
                        "Check bookings",
                        "View ".concat(context.inferredPreferences.preferredCategories[1] || context.inferredPreferences.preferredCategories[0], " wishlist")
                    ];
                }
                return [2 /*return*/, {
                        text: "Hello! How can I assist you today?",
                        suggestions: defaultSuggestions
                    }];
            });
        });
    };
    /**
     * Log an interaction for self-improvement
     * @param userMessage The user's input message
     * @param response The AI-generated response
     * @param context Context information about the user and conversation
     */
    RenAIService.prototype.logInteraction = function (userMessage, response, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Log the interaction to a database or external service for analysis
                    return [4 /*yield*/, prisma.interaction.create({
                            data: {
                                userId: context.userId,
                                sessionId: context.sessionId,
                                userMessage: userMessage,
                                responseText: response.text,
                                responseSuggestions: response.suggestions,
                                responseAction: response.action,
                                conversationHistory: context.conversationHistory,
                                userSentiment: context.userSentiment,
                                userIntent: context.userIntent,
                                conversationState: context.conversationState,
                                rememberedPreferences: context.rememberedPreferences,
                                createdAt: new Date()
                            }
                        })];
                    case 1:
                        // Log the interaction to a database or external service for analysis
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a wizard step
     * @param message The user's input message
     * @param context The conversation context
     * @returns AI-generated response
     */
    RenAIService.prototype.processWizardStep = function (message, context) {
        var _a;
        if (!((_a = context.conversationState) === null || _a === void 0 ? void 0 : _a.wizard)) {
            return null;
        }
        var wizardState = context.conversationState.wizard;
        var wizard = this.wizards[wizardState.type];
        if (!wizard) {
            return null;
        }
        var currentStep = wizard.steps[wizardState.step];
        // Store the user's response for the current step
        wizardState.data[currentStep.expectedData] = message;
        // Move to the next step
        wizardState.step++;
        // Check if we've completed all steps
        if (wizardState.step >= wizard.steps.length) {
            // Wizard completed
            var summary = this.generateWizardSummary(wizardState);
            // Clear wizard state
            context.conversationState.wizard = undefined;
            return {
                text: "Great! You've completed the ".concat(wizardState.type, " process. Here's a summary of what we collected:\n\n").concat(summary, "\n\nWould you like to proceed with creating your listing or booking?"),
                suggestions: ["Yes, proceed", "Review my information", "Start over"],
                action: {
                    type: "wizard_complete_".concat(wizardState.type),
                    payload: { data: wizardState.data }
                }
            };
        }
        // Update progress
        wizardState.progress = Math.round((wizardState.step / wizardState.totalSteps) * 100);
        // Get next step
        var nextStep = wizard.steps[wizardState.step];
        return {
            text: "Step ".concat(wizardState.step + 1, " of ").concat(wizardState.totalSteps, ": ").concat(nextStep.prompt, "\n\nProgress: ").concat(wizardState.progress, "%"),
            suggestions: nextStep.examples || nextStep.options || ["Continue"]
        };
    };
    /**
     * Start a wizard
     * @param type The type of wizard to start
     * @param context The conversation context
     * @returns AI-generated response
     */
    RenAIService.prototype.startWizard = function (type, context) {
        var wizard = this.wizards[type];
        context.conversationState = {
            wizard: {
                type: type,
                step: 0,
                totalSteps: wizard.totalSteps,
                data: {},
                progress: 0
            }
        };
        var firstStep = wizard.steps[0];
        return {
            text: firstStep.prompt,
            suggestions: firstStep.options
        };
    };
    /**
     * Process a user message using the DeepSeek-R1 model (OpenRouter)
     * @param message The user's input message
     * @param context Context information about the user and conversation
     * @returns AI-generated response
     */
    RenAIService.prototype.processWithOpenRouter = function (message, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.sendMessage(message, context)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Get personalized recommendations for a user
     * @param userId The user ID to get recommendations for
     * @returns Array of recommended listings
     */
    /**
     * Get personalized recommendations for a user
     * @param userId The user ID to get recommendations for
     * @returns Array of recommended listings
     */
    RenAIService.prototype.getRecommendations = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var collaborativeRecs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollaborativeRecommendations(userId)];
                    case 1:
                        collaborativeRecs = _a.sent();
                        if (collaborativeRecs.length > 0) {
                            return [2 /*return*/, collaborativeRecs];
                        }
                        return [4 /*yield*/, this.getPersonalizedRecommendations(userId)];
                    case 2: 
                    // Fallback to personalized recommendations
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get live database information about a specific listing
     * @param listingId The ID of the listing to get information for
     * @returns Listing information
     */
    RenAIService.prototype.getListingInfo = function (listingId) {
        return __awaiter(this, void 0, void 0, function () {
            var listing, totalRating, averageRating, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.listing.findUnique({
                                where: { id: listingId },
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            id: true,
                                            rating: true,
                                            comment: true,
                                            user: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            },
                                            createdAt: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        listing = _a.sent();
                        if (!listing) {
                            return [2 /*return*/, null];
                        }
                        totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                        averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                        return [2 /*return*/, {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                features: JSON.parse(listing.features || '[]'),
                                ownerId: listing.ownerId,
                                owner: listing.owner,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                reviews: listing.reviews,
                                createdAt: listing.createdAt
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting listing info:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get live trending listings for recommendations
     * @returns Array of trending listings
     */
    RenAIService.prototype.getTrendingListings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listings, enrichedListings, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.listing.findMany({
                                take: 10,
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        listings = _a.sent();
                        enrichedListings = listings.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        });
                        return [2 /*return*/, enrichedListings];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting trending listings:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search listings using natural language query
     * @param query Natural language search query
     * @param context Current user context
     * @returns Array of matching listings
     */
    RenAIService.prototype.searchListingsWithNaturalLanguage = function (query, context) {
        return __awaiter(this, void 0, void 0, function () {
            var entities, searchCriteria, referencePrice, listings, enrichedListings, error_5;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        entities = this.extractEntities(query);
                        searchCriteria = {};
                        // Add item search criteria
                        if ((_a = entities === null || entities === void 0 ? void 0 : entities.items) === null || _a === void 0 ? void 0 : _a.length) {
                            searchCriteria.OR = [
                                { title: { contains: entities.items[0], mode: 'insensitive' } },
                                { description: { contains: entities.items[0], mode: 'insensitive' } }
                            ];
                        }
                        // Add location search criteria
                        if ((_b = entities === null || entities === void 0 ? void 0 : entities.locations) === null || _b === void 0 ? void 0 : _b.length) {
                            searchCriteria.location = { contains: entities.locations[0], mode: 'insensitive' };
                        }
                        // Add price range criteria
                        if ((_c = entities === null || entities === void 0 ? void 0 : entities.prices) === null || _c === void 0 ? void 0 : _c.length) {
                            referencePrice = entities.prices[0];
                            searchCriteria.price = {
                                gte: referencePrice * 0.7, // 30% below
                                lte: referencePrice * 1.3 // 30% above
                            };
                        }
                        // Add date criteria if needed (for availability)
                        if ((_d = entities === null || entities === void 0 ? void 0 : entities.dates) === null || _d === void 0 ? void 0 : _d.length) {
                            // For now, we'll just log that date information was found
                            console.log('Date entities found:', entities.dates);
                        }
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: searchCriteria,
                                take: 10,
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        listings = _e.sent();
                        enrichedListings = listings.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        });
                        return [2 /*return*/, enrichedListings];
                    case 2:
                        error_5 = _e.sent();
                        console.error('Error searching listings with natural language:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user's recent activity for context
     * @param userId The user ID to get activity for
     * @returns User activity information
     */
    RenAIService.prototype.getUserActivity = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var recentBookings, wishlistItems, unreadMessages, recentReviews, recentListings, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    createdAt: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            price: true,
                                            category: true
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 5
                            })];
                    case 1:
                        recentBookings = _a.sent();
                        return [4 /*yield*/, prisma.wishlist.findMany({
                                where: {
                                    userId: userId
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            price: true,
                                            category: true
                                        }
                                    }
                                },
                                take: 5
                            })];
                    case 2:
                        wishlistItems = _a.sent();
                        return [4 /*yield*/, prisma.message.count({
                                where: {
                                    receiverId: userId,
                                    read: false
                                }
                            })];
                    case 3:
                        unreadMessages = _a.sent();
                        return [4 /*yield*/, prisma.review.findMany({
                                where: {
                                    userId: userId,
                                    createdAt: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 5
                            })];
                    case 4:
                        recentReviews = _a.sent();
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    ownerId: userId,
                                    createdAt: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                },
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    price: true,
                                    category: true,
                                    createdAt: true
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 5
                            })];
                    case 5:
                        recentListings = _a.sent();
                        return [2 /*return*/, {
                                recentBookings: recentBookings,
                                wishlistItems: wishlistItems,
                                unreadMessages: unreadMessages,
                                recentReviews: recentReviews,
                                recentListings: recentListings
                            }];
                    case 6:
                        error_6 = _a.sent();
                        console.error('Error getting user activity:', error_6);
                        return [2 /*return*/, {
                                recentBookings: [],
                                wishlistItems: [],
                                unreadMessages: 0,
                                recentReviews: [],
                                recentListings: []
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get smart notifications for relevant listings based on user preferences
     * @param userId The user ID to get notifications for
     * @param context Current user context
     * @returns Array of smart notifications
     */
    RenAIService.prototype.getSmartNotifications = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications, persona, userActivity, _i, _a, wishlistItem, listing, similarListings, cheaperListing, popularListings, _b, popularListings_1, listing, currentMonth, seasonalSuggestions, suggestion, error_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        notifications = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 2:
                        persona = _c.sent();
                        if (!persona) {
                            return [2 /*return*/, notifications];
                        }
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 3:
                        userActivity = _c.sent();
                        _i = 0, _a = userActivity.wishlistItems;
                        _c.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        wishlistItem = _a[_i];
                        listing = wishlistItem.listing;
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            description: {
                                                contains: listing.description,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            price: {
                                                lt: listing.price * 0.9 // 10% lower
                                            }
                                        },
                                        {
                                            id: {
                                                not: listing.id
                                            }
                                        }
                                    ]
                                },
                                take: 1,
                                orderBy: {
                                    price: 'asc'
                                }
                            })];
                    case 5:
                        similarListings = _c.sent();
                        if (similarListings.length > 0) {
                            cheaperListing = similarListings[0];
                            notifications.push({
                                type: "price_drop",
                                message: "Price drop alert! Similar item \"".concat(cheaperListing.title, "\" is available for \u20B1").concat(cheaperListing.price, " (\u20B1").concat(listing.price - cheaperListing.price, " cheaper than your wishlist item)"),
                                listingId: cheaperListing.id,
                                priority: 8
                            });
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!(persona.favoriteCategories.length > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            category: {
                                                in: persona.favoriteCategories
                                            }
                                        },
                                        {
                                            createdAt: {
                                                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                                            }
                                        }
                                    ]
                                },
                                take: 3,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            })];
                    case 8:
                        popularListings = _c.sent();
                        for (_b = 0, popularListings_1 = popularListings; _b < popularListings_1.length; _b++) {
                            listing = popularListings_1[_b];
                            notifications.push({
                                type: "new_popular_item",
                                message: "New popular item in your favorite category: \"".concat(listing.title, "\" just listed!"),
                                listingId: listing.id,
                                priority: 6
                            });
                        }
                        _c.label = 9;
                    case 9:
                        // Seasonal listing suggestions for owners
                        if (userActivity.recentListings.length > 0) {
                            currentMonth = new Date().getMonth();
                            seasonalSuggestions = {
                                0: "New Year party supplies",
                                1: "Valentine's Day gifts",
                                2: "Gardening tools",
                                3: "Umbrellas and rain gear",
                                4: "Summer sports equipment",
                                5: "Beach and swimming gear",
                                6: "Summer party supplies",
                                7: "Back-to-school supplies",
                                8: "Outdoor cooking equipment",
                                9: "Halloween decorations",
                                10: "Holiday decorations",
                                11: "Christmas gifts"
                            };
                            suggestion = seasonalSuggestions[currentMonth];
                            if (suggestion) {
                                notifications.push({
                                    type: "seasonal_listing_suggestion",
                                    message: "Seasonal opportunity: Consider listing ".concat(suggestion, " to capitalize on upcoming demand"),
                                    priority: 5
                                });
                            }
                        }
                        // Sort notifications by priority
                        return [2 /*return*/, notifications.sort(function (a, b) { return b.priority - a.priority; })];
                    case 10:
                        error_7 = _c.sent();
                        console.error('Error getting smart notifications:', error_7);
                        return [2 /*return*/, notifications];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get predictive assistance based on user patterns
     * @param userId The user ID to get predictions for
     * @param context Current user context
     * @returns Array of predictive assistance suggestions
     */
    RenAIService.prototype.getPredictiveAssistance = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var predictions, persona, userActivity, lastBooking, daysSinceLastBooking, lastListing, daysSinceLastListing, currentHour, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        predictions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 2:
                        persona = _a.sent();
                        if (!persona) {
                            return [2 /*return*/, predictions];
                        }
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 3:
                        userActivity = _a.sent();
                        // Predictive assistance based on user type
                        switch (persona.userType) {
                            case 'power_user':
                                predictions.push({
                                    type: "power_user_tip",
                                    message: "As a power user, you might want to try our advanced search filters to find exactly what you need faster.",
                                    action: "show_advanced_search",
                                    priority: 8
                                });
                                break;
                            case 'active':
                                predictions.push({
                                    type: "active_user_tip",
                                    message: "You're an active user! Consider upgrading to premium for exclusive benefits and lower fees.",
                                    action: "show_premium_benefits",
                                    priority: 7
                                });
                                break;
                            case 'casual':
                                predictions.push({
                                    type: "casual_user_tip",
                                    message: "New to renting? Check out our beginner's guide to get started!",
                                    action: "show_beginner_guide",
                                    priority: 6
                                });
                                break;
                        }
                        // Predictive assistance based on engagement level
                        switch (persona.engagementLevel) {
                            case 'high':
                                predictions.push({
                                    type: "engagement_tip",
                                    message: "You're highly engaged with our platform! Refer a friend and earn rewards.",
                                    action: "show_referral_program",
                                    priority: 9
                                });
                                break;
                            case 'medium':
                                predictions.push({
                                    type: "engagement_tip",
                                    message: "You're getting familiar with our platform. Try listing an item you're not using to earn extra income.",
                                    action: "show_listing_guide",
                                    priority: 7
                                });
                                break;
                            case 'low':
                                predictions.push({
                                    type: "engagement_tip",
                                    message: "Welcome! Explore our trending items to discover what's popular right now.",
                                    action: "show_trending_items",
                                    priority: 5
                                });
                                break;
                        }
                        // Predictive assistance based on user tenure
                        if (persona.tenureDays > 365) {
                            predictions.push({
                                type: "loyalty_tip",
                                message: "Thank you for being a loyal user for over a year! Enjoy exclusive benefits as a long-term member.",
                                action: "show_loyalty_benefits",
                                priority: 10
                            });
                        }
                        else if (persona.tenureDays > 180) {
                            predictions.push({
                                type: "milestone_tip",
                                message: "You've been with us for 6 months! Keep going and unlock more features.",
                                action: "show_user_progress",
                                priority: 8
                            });
                        }
                        // Predictive assistance based on recent activity
                        if (userActivity.recentBookings.length > 0) {
                            lastBooking = userActivity.recentBookings[0];
                            daysSinceLastBooking = Math.floor((Date.now() - lastBooking.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                            if (daysSinceLastBooking > 30) {
                                predictions.push({
                                    type: "return_user_tip",
                                    message: "It's been a while since your last rental. Check out new arrivals in categories you've rented before.",
                                    action: "show_new_arrivals",
                                    priority: 7
                                });
                            }
                        }
                        if (userActivity.recentListings.length > 0) {
                            lastListing = userActivity.recentListings[0];
                            daysSinceLastListing = Math.floor((Date.now() - lastListing.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                            if (daysSinceLastListing > 60) {
                                predictions.push({
                                    type: "owner_tip",
                                    message: "Your listings could be earning more. Try updating your item descriptions with better photos.",
                                    action: "show_listing_optimization_tips",
                                    priority: 8
                                });
                            }
                        }
                        currentHour = new Date().getHours();
                        if (currentHour >= 18 && currentHour <= 24) {
                            predictions.push({
                                type: "evening_tip",
                                message: "Evening is a great time to list items for rent. People browse more in the evening!",
                                action: "show_listing_form",
                                priority: 6
                            });
                        }
                        else if (currentHour >= 9 && currentHour <= 17) {
                            predictions.push({
                                type: "business_hours_tip",
                                message: "Business hours are perfect for browsing rentals. Check out what's new!",
                                action: "show_browse_page",
                                priority: 6
                            });
                        }
                        // Sort predictions by priority
                        return [2 /*return*/, predictions.sort(function (a, b) { return b.priority - a.priority; })];
                    case 4:
                        error_8 = _a.sent();
                        console.error('Error getting predictive assistance:', error_8);
                        return [2 /*return*/, predictions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get automated booking assistance with alternatives
     * @param userId The user ID to get assistance for
     * @param context Current user context
     * @param originalListingId The ID of the original listing user wanted to book
     * @returns Array of booking assistance suggestions
     */
    RenAIService.prototype.getBookingAssistance = function (userId, context, originalListingId) {
        return __awaiter(this, void 0, void 0, function () {
            var assistance, originalListing, similarListings, _i, similarListings_1, listing, priceRangeListings, _a, priceRangeListings_1, listing, priceDifference, percentageDifference, userPersona, categoryAlternatives, _b, categoryAlternatives_1, listing, error_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        assistance = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, prisma.listing.findUnique({
                                where: { id: originalListingId },
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    price: true,
                                    category: true
                                }
                            })];
                    case 2:
                        originalListing = _c.sent();
                        if (!originalListing) {
                            return [2 /*return*/, assistance];
                        }
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            category: originalListing.category
                                        },
                                        {
                                            id: {
                                                not: originalListing.id
                                            }
                                        }
                                    ]
                                },
                                take: 5,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            })];
                    case 3:
                        similarListings = _c.sent();
                        // Add alternatives
                        for (_i = 0, similarListings_1 = similarListings; _i < similarListings_1.length; _i++) {
                            listing = similarListings_1[_i];
                            assistance.push({
                                type: "alternative_listing",
                                message: "Alternative option: \"".concat(listing.title, "\" for \u20B1").concat(listing.price, "/day"),
                                listingId: listing.id,
                                priority: 8
                            });
                        }
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            category: originalListing.category
                                        },
                                        {
                                            price: {
                                                gte: originalListing.price * 0.7,
                                                lte: originalListing.price * 1.3
                                            }
                                        },
                                        {
                                            id: {
                                                not: originalListing.id
                                            }
                                        }
                                    ]
                                },
                                take: 3,
                                orderBy: {
                                    price: 'asc'
                                }
                            })];
                    case 4:
                        priceRangeListings = _c.sent();
                        // Add price alternatives
                        for (_a = 0, priceRangeListings_1 = priceRangeListings; _a < priceRangeListings_1.length; _a++) {
                            listing = priceRangeListings_1[_a];
                            priceDifference = listing.price - originalListing.price;
                            percentageDifference = Math.round((priceDifference / originalListing.price) * 100);
                            if (priceDifference < 0) {
                                assistance.push({
                                    type: "cheaper_alternative",
                                    message: "Cheaper option: \"".concat(listing.title, "\" for \u20B1").concat(listing.price, "/day (").concat(Math.abs(percentageDifference), "% less)"),
                                    listingId: listing.id,
                                    priority: 9
                                });
                            }
                            else {
                                assistance.push({
                                    type: "premium_alternative",
                                    message: "Premium option: \"".concat(listing.title, "\" for \u20B1").concat(listing.price, "/day (").concat(percentageDifference, "% more)"),
                                    listingId: listing.id,
                                    priority: 7
                                });
                            }
                        }
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 5:
                        userPersona = _c.sent();
                        if (!(userPersona && userPersona.favoriteCategories.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    category: {
                                        in: userPersona.favoriteCategories
                                    }
                                },
                                take: 3,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            })];
                    case 6:
                        categoryAlternatives = _c.sent();
                        for (_b = 0, categoryAlternatives_1 = categoryAlternatives; _b < categoryAlternatives_1.length; _b++) {
                            listing = categoryAlternatives_1[_b];
                            assistance.push({
                                type: "favorite_category_alternative",
                                message: "Based on your preferences: \"".concat(listing.title, "\" in your favorite category"),
                                listingId: listing.id,
                                priority: 6
                            });
                        }
                        _c.label = 7;
                    case 7: 
                    // Sort assistance by priority
                    return [2 /*return*/, assistance.sort(function (a, b) { return b.priority - a.priority; })];
                    case 8:
                        error_9 = _c.sent();
                        console.error('Error getting booking assistance:', error_9);
                        return [2 /*return*/, assistance];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get availability alerts for popular items
     * @param userId The user ID to get alerts for
     * @returns Array of availability alerts
     */
    RenAIService.prototype.getAvailabilityAlerts = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var alerts, persona, wishlistItems, _i, wishlistItems_1, wishlistItem, listing, similarListings, _a, similarListings_2, newItem, trendingListings, _b, trendingListings_1, listing, error_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        alerts = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 2:
                        persona = _c.sent();
                        if (!persona) {
                            return [2 /*return*/, alerts];
                        }
                        return [4 /*yield*/, prisma.wishlist.findMany({
                                where: {
                                    userId: userId
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true
                                        }
                                    }
                                }
                            })];
                    case 3:
                        wishlistItems = _c.sent();
                        _i = 0, wishlistItems_1 = wishlistItems;
                        _c.label = 4;
                    case 4:
                        if (!(_i < wishlistItems_1.length)) return [3 /*break*/, 7];
                        wishlistItem = wishlistItems_1[_i];
                        listing = wishlistItem.listing;
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            description: {
                                                contains: listing.description,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            createdAt: {
                                                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                                            }
                                        },
                                        {
                                            id: {
                                                not: listing.id
                                            }
                                        }
                                    ]
                                },
                                take: 2,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            })];
                    case 5:
                        similarListings = _c.sent();
                        // Create alerts for newly available similar items
                        for (_a = 0, similarListings_2 = similarListings; _a < similarListings_2.length; _a++) {
                            newItem = similarListings_2[_a];
                            alerts.push({
                                type: "availability_alert",
                                message: "Newly available: Similar item \"".concat(newItem.title, "\" just listed!"),
                                listingId: newItem.id,
                                priority: 7
                            });
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!(persona.favoriteCategories.length > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            category: {
                                                in: persona.favoriteCategories
                                            }
                                        },
                                        {
                                            createdAt: {
                                                gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
                                            }
                                        }
                                    ]
                                },
                                take: 3,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            })];
                    case 8:
                        trendingListings = _c.sent();
                        // Create alerts for trending items
                        for (_b = 0, trendingListings_1 = trendingListings; _b < trendingListings_1.length; _b++) {
                            listing = trendingListings_1[_b];
                            alerts.push({
                                type: "trending_item",
                                message: "Trending now: \"".concat(listing.title, "\" is getting popular!"),
                                listingId: listing.id,
                                priority: 6
                            });
                        }
                        _c.label = 9;
                    case 9: 
                    // Sort alerts by priority
                    return [2 /*return*/, alerts.sort(function (a, b) { return b.priority - a.priority; })];
                    case 10:
                        error_10 = _c.sent();
                        console.error('Error getting availability alerts:', error_10);
                        return [2 /*return*/, alerts];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get price drop notifications for wishlist items
     * @param userId The user ID to get notifications for
     * @returns Array of price drop notifications
     */
    RenAIService.prototype.getPriceDropNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications, wishlistItems, _i, wishlistItems_2, wishlistItem, listing, similarListings, _a, similarListings_3, cheaperListing, priceDifference, percentageDrop, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        notifications = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, prisma.wishlist.findMany({
                                where: {
                                    userId: userId
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            price: true,
                                            description: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        wishlistItems = _b.sent();
                        _i = 0, wishlistItems_2 = wishlistItems;
                        _b.label = 3;
                    case 3:
                        if (!(_i < wishlistItems_2.length)) return [3 /*break*/, 6];
                        wishlistItem = wishlistItems_2[_i];
                        listing = wishlistItem.listing;
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            description: {
                                                contains: listing.description,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            price: {
                                                lt: listing.price
                                            }
                                        },
                                        {
                                            id: {
                                                not: listing.id
                                            }
                                        }
                                    ]
                                },
                                take: 3,
                                orderBy: {
                                    price: 'asc'
                                }
                            })];
                    case 4:
                        similarListings = _b.sent();
                        // Create notifications for each cheaper listing
                        for (_a = 0, similarListings_3 = similarListings; _a < similarListings_3.length; _a++) {
                            cheaperListing = similarListings_3[_a];
                            priceDifference = listing.price - cheaperListing.price;
                            percentageDrop = Math.round((priceDifference / listing.price) * 100);
                            notifications.push({
                                type: "wishlist_price_drop",
                                message: "Price drop! \"".concat(cheaperListing.title, "\" is now \u20B1").concat(cheaperListing.price, " (").concat(percentageDrop, "% cheaper than your wishlist item \"").concat(listing.title, "\")"),
                                listingId: cheaperListing.id,
                                priority: 9,
                                priceDifference: priceDifference
                            });
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: 
                    // Sort notifications by priority
                    return [2 /*return*/, notifications.sort(function (a, b) { return b.priority - a.priority; })];
                    case 7:
                        error_11 = _b.sent();
                        console.error('Error getting price drop notifications:', error_11);
                        return [2 /*return*/, notifications];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get reminders for upcoming bookings or return dates
     * @param userId The user ID to get reminders for
     * @returns Array of booking reminders
     */
    RenAIService.prototype.getBookingReminders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var reminders, upcomingBookings, endingBookings, _i, upcomingBookings_1, booking, timeUntilStart, _a, endingBookings_1, booking, timeUntilEnd, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reminders = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    startDate: {
                                        gte: new Date(),
                                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
                                    },
                                    status: 'confirmed'
                                },
                                include: {
                                    listing: {
                                        select: {
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    startDate: 'asc'
                                }
                            })];
                    case 2:
                        upcomingBookings = _b.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    endDate: {
                                        gte: new Date(),
                                        lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Next 2 days
                                    },
                                    status: 'confirmed'
                                },
                                include: {
                                    listing: {
                                        select: {
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    endDate: 'asc'
                                }
                            })];
                    case 3:
                        endingBookings = _b.sent();
                        // Create pickup reminders
                        for (_i = 0, upcomingBookings_1 = upcomingBookings; _i < upcomingBookings_1.length; _i++) {
                            booking = upcomingBookings_1[_i];
                            timeUntilStart = Math.ceil((booking.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            if (timeUntilStart <= 1) {
                                reminders.push({
                                    type: "pickup_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" starts tomorrow. Don't forget to pick it up!"),
                                    bookingId: booking.id,
                                    priority: 9,
                                    timeUntilEvent: "".concat(timeUntilStart, " day").concat(timeUntilStart !== 1 ? 's' : '')
                                });
                            }
                            else if (timeUntilStart <= 3) {
                                reminders.push({
                                    type: "pickup_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" starts in ").concat(timeUntilStart, " days. Plan accordingly!"),
                                    bookingId: booking.id,
                                    priority: 8,
                                    timeUntilEvent: "".concat(timeUntilStart, " days")
                                });
                            }
                        }
                        // Create return reminders
                        for (_a = 0, endingBookings_1 = endingBookings; _a < endingBookings_1.length; _a++) {
                            booking = endingBookings_1[_a];
                            timeUntilEnd = Math.ceil((booking.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            if (timeUntilEnd <= 1) {
                                reminders.push({
                                    type: "return_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" is due back tomorrow. Don't forget to return it!"),
                                    bookingId: booking.id,
                                    priority: 9,
                                    timeUntilEvent: "".concat(timeUntilEnd, " day").concat(timeUntilEnd !== 1 ? 's' : '')
                                });
                            }
                            else if (timeUntilEnd <= 3) {
                                reminders.push({
                                    type: "return_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" is due back in ").concat(timeUntilEnd, " days. Plan accordingly!"),
                                    bookingId: booking.id,
                                    priority: 8,
                                    timeUntilEvent: "".concat(timeUntilEnd, " days")
                                });
                            }
                        }
                        return [2 /*return*/, reminders];
                    case 4:
                        error_12 = _b.sent();
                        console.error('Error getting booking reminders:', error_12);
                        return [2 /*return*/, reminders];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement voice interface with voice-activated assistance
     * @param context Current user context
     * @returns Voice interface guidance
     */
    RenAIService.prototype.getVoiceInterfaceGuidance = function (context) {
        return {
            activation: [
                "Say 'Hey REN' to activate voice assistance",
                "Speak naturally - I understand conversational language",
                "You can ask questions like 'Find camera rentals near me' or 'List my tools'"
            ],
            features: [
                "Search for rentals using voice commands",
                "List items for rent through voice guidance",
                "Manage bookings and check status updates",
                "Get personalized recommendations",
                "Navigate the platform hands-free"
            ],
            tips: [
                "Speak clearly in a quiet environment for best results",
                "Use specific terms like 'camera', 'tool', or 'party supplies'",
                "You can interrupt me at any time by saying 'Stop' or 'Cancel'",
                "I'll confirm important actions before proceeding"
            ]
        };
    };
    /**
     * Add voice search capabilities
     * @param voiceInput The voice input transcribed to text
     * @param context Current user context
     * @returns Voice search results and suggestions
     */
    RenAIService.prototype.processVoiceSearch = function (voiceInput, context) {
        return __awaiter(this, void 0, void 0, function () {
            var entities, searchCriteria, referencePrice, listings, enrichedListings, error_13;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        entities = this.extractEntities(voiceInput);
                        searchCriteria = {};
                        // Add item search criteria
                        if ((_a = entities === null || entities === void 0 ? void 0 : entities.items) === null || _a === void 0 ? void 0 : _a.length) {
                            searchCriteria.OR = [
                                { title: { contains: entities.items[0], mode: 'insensitive' } },
                                { description: { contains: entities.items[0], mode: 'insensitive' } }
                            ];
                        }
                        // Add location search criteria
                        if ((_b = entities === null || entities === void 0 ? void 0 : entities.locations) === null || _b === void 0 ? void 0 : _b.length) {
                            searchCriteria.location = { contains: entities.locations[0], mode: 'insensitive' };
                        }
                        // Add price range criteria
                        if ((_c = entities === null || entities === void 0 ? void 0 : entities.prices) === null || _c === void 0 ? void 0 : _c.length) {
                            referencePrice = entities.prices[0];
                            searchCriteria.price = {
                                gte: referencePrice * 0.7, // 30% below
                                lte: referencePrice * 1.3 // 30% above
                            };
                        }
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: searchCriteria,
                                take: 5,
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        listings = _d.sent();
                        enrichedListings = listings.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        });
                        return [2 /*return*/, {
                                results: enrichedListings,
                                query: voiceInput,
                                entities: entities,
                                resultCount: enrichedListings.length
                            }];
                    case 2:
                        error_13 = _d.sent();
                        console.error('Error processing voice search:', error_13);
                        return [2 /*return*/, {
                                results: [],
                                query: voiceInput,
                                entities: null,
                                resultCount: 0,
                                error: 'Failed to process voice search'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement audio responses for accessibility
     * @param responseText The text to convert to audio
     * @param context Current user context
     * @returns Audio response guidance
     */
    RenAIService.prototype.getAudioResponseGuidance = function (responseText, context) {
        return {
            features: [
                "Text-to-speech for all AI responses",
                "Adjustable speech speed and voice preferences",
                "Audio notifications for important updates",
                "Voice feedback for actions and confirmations"
            ],
            settings: [
                "Choose from multiple voice options",
                "Adjust speech rate (slow, normal, fast)",
                "Enable/disable audio responses",
                "Customize audio notification types"
            ],
            accessibility: [
                "Full compatibility with screen readers",
                "Audio descriptions for visual content",
                "Keyboard navigation support",
                "High contrast mode options"
            ]
        };
    };
    /**
     * Add image-based search and recognition
     * @param imageDescription Description of the image content
     * @param context Current user context
     * @returns Image search results and suggestions
     */
    RenAIService.prototype.processImageSearch = function (imageDescription, context) {
        return __awaiter(this, void 0, void 0, function () {
            var entities, searchCriteria, listings, enrichedListings, error_14;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        entities = this.extractEntities(imageDescription);
                        searchCriteria = {};
                        // Add item search criteria
                        if ((_a = entities === null || entities === void 0 ? void 0 : entities.items) === null || _a === void 0 ? void 0 : _a.length) {
                            searchCriteria.OR = [
                                { title: { contains: entities.items[0], mode: 'insensitive' } },
                                { description: { contains: entities.items[0], mode: 'insensitive' } },
                                { category: { contains: entities.items[0], mode: 'insensitive' } }
                            ];
                        }
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: searchCriteria,
                                take: 5,
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        listings = _b.sent();
                        enrichedListings = listings.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        });
                        return [2 /*return*/, {
                                results: enrichedListings,
                                query: imageDescription,
                                entities: entities,
                                resultCount: enrichedListings.length
                            }];
                    case 2:
                        error_14 = _b.sent();
                        console.error('Error processing image search:', error_14);
                        return [2 /*return*/, {
                                results: [],
                                query: imageDescription,
                                entities: null,
                                resultCount: 0,
                                error: 'Failed to process image search'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement visual tutorials and guides
     * @param tutorialTopic The topic for the tutorial
     * @param context Current user context
     * @returns Visual tutorial content
     */
    RenAIService.prototype.getVisualTutorial = function (tutorialTopic, context) {
        var tutorials = {
            "listing": {
                title: "How to List an Item",
                steps: [
                    {
                        step: 1,
                        title: "Navigate to Listing Page",
                        description: "Click on 'List Item' in the navigation menu",
                        visual: "screenshot of navigation menu with 'List Item' highlighted"
                    },
                    {
                        step: 2,
                        title: "Fill in Item Details",
                        description: "Enter title, description, price, and location",
                        visual: "screenshot of listing form with example data"
                    },
                    {
                        step: 3,
                        title: "Upload Photos",
                        description: "Add clear photos of your item from multiple angles",
                        visual: "screenshot of photo upload interface"
                    },
                    {
                        step: 4,
                        title: "Set Availability",
                        description: "Mark dates when your item is available for rent",
                        visual: "screenshot of calendar with available dates marked"
                    },
                    {
                        step: 5,
                        title: "Publish Listing",
                        description: "Review and publish your listing to make it visible",
                        visual: "screenshot of publish button and confirmation"
                    }
                ]
            },
            "booking": {
                title: "How to Book an Item",
                steps: [
                    {
                        step: 1,
                        title: "Search for Items",
                        description: "Use the search bar or browse categories to find items",
                        visual: "screenshot of search interface"
                    },
                    {
                        step: 2,
                        title: "View Item Details",
                        description: "Click on an item to see photos, description, and reviews",
                        visual: "screenshot of item detail page"
                    },
                    {
                        step: 3,
                        title: "Select Dates",
                        description: "Choose your rental dates from the calendar",
                        visual: "screenshot of date selection calendar"
                    },
                    {
                        step: 4,
                        title: "Confirm Booking",
                        description: "Review details and confirm your booking",
                        visual: "screenshot of booking confirmation page"
                    },
                    {
                        step: 5,
                        title: "Make Payment",
                        description: "Complete payment through our secure system",
                        visual: "screenshot of payment interface"
                    }
                ]
            },
            "messaging": {
                title: "How to Use Messaging",
                steps: [
                    {
                        step: 1,
                        title: "Access Inbox",
                        description: "Click on 'Messages' in the navigation menu",
                        visual: "screenshot of navigation menu with 'Messages' highlighted"
                    },
                    {
                        step: 2,
                        title: "View Conversations",
                        description: "See all your conversations with renters and owners",
                        visual: "screenshot of conversation list"
                    },
                    {
                        step: 3,
                        title: "Send Messages",
                        description: "Type your message and click send to communicate",
                        visual: "screenshot of message input field"
                    },
                    {
                        step: 4,
                        title: "Attach Files",
                        description: "Upload photos or documents to share with the other party",
                        visual: "screenshot of file attachment interface"
                    }
                ]
            }
        };
        return tutorials[tutorialTopic] || {
            title: "Tutorial Not Found",
            steps: [
                {
                    step: 1,
                    title: "General Help",
                    description: "I can help you with listing items, booking rentals, or using platform features. What would you like to learn about?",
                    visual: "screenshot of help page"
                }
            ]
        };
    };
    /**
     * Add augmented reality previews for items
     * @param listingId The ID of the listing to preview
     * @param context Current user context
     * @returns AR preview guidance
     */
    RenAIService.prototype.getArPreviewGuidance = function (listingId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var listing, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.listing.findUnique({
                                where: { id: listingId },
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    images: true,
                                    dimensions: true,
                                    category: true
                                }
                            })];
                    case 1:
                        listing = _a.sent();
                        if (!listing) {
                            return [2 /*return*/, {
                                    error: "Listing not found"
                                }];
                        }
                        return [2 /*return*/, {
                                listing: {
                                    id: listing.id,
                                    title: listing.title,
                                    description: listing.description,
                                    images: JSON.parse(listing.images || '[]'),
                                    dimensions: listing.dimensions || "Dimensions not specified",
                                    category: listing.category || "General item"
                                },
                                arFeatures: [
                                    "View item in your space using camera",
                                    "See actual size and scale",
                                    "Rotate and examine from all angles",
                                    "Compare with similar items",
                                    "Visualize in different environments"
                                ],
                                instructions: [
                                    "Open the RenThing mobile app",
                                    "Navigate to the item details page",
                                    "Tap the 'AR Preview' button",
                                    "Point your camera at the desired location",
                                    "Adjust position and size as needed"
                                ],
                                compatibility: [
                                    "Requires iOS 11+ or Android 8+",
                                    "Works with most modern smartphones",
                                    "No additional hardware required",
                                    "Internet connection recommended for best experience"
                                ]
                            }];
                    case 2:
                        error_15 = _a.sent();
                        console.error('Error getting AR preview guidance:', error_15);
                        return [2 /*return*/, {
                                error: "Failed to retrieve AR preview information"
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement SMS integration for notifications
     * @param userId The user ID
     * @param context Current user context
     * @returns SMS notification settings and options
     */
    RenAIService.prototype.getSmsNotificationOptions = function (userId, context) {
        return {
            notificationTypes: [
                {
                    type: "booking_confirmation",
                    description: "Get SMS when a booking is confirmed",
                    enabledByDefault: true
                },
                {
                    type: "payment_reminder",
                    description: "Receive payment reminders via SMS",
                    enabledByDefault: true
                },
                {
                    type: "upcoming_rental",
                    description: "SMS reminder before rental starts",
                    enabledByDefault: true
                },
                {
                    type: "return_reminder",
                    description: "Reminder to return items on time",
                    enabledByDefault: true
                },
                {
                    type: "message_notification",
                    description: "SMS when you receive new messages",
                    enabledByDefault: false
                }
            ],
            preferences: [
                "Set preferred SMS time (morning, afternoon, evening)",
                "Choose which notifications to receive via SMS",
                "Enable/disable SMS notifications entirely",
                "Update phone number for SMS delivery"
            ],
            tips: [
                "Standard messaging rates may apply",
                "You can unsubscribe at any time by replying 'STOP'",
                "SMS notifications are in addition to email and app notifications",
                "International SMS may have additional charges"
            ]
        };
    };
    /**
     * Add push notifications for mobile users
     * @param context Current user context
     * @returns Push notification settings and options
     */
    RenAIService.prototype.getPushNotificationOptions = function (context) {
        return {
            notificationTypes: [
                {
                    type: "instant_message",
                    description: "Real-time notifications for new messages",
                    enabledByDefault: true
                },
                {
                    type: "booking_updates",
                    description: "Updates on booking status changes",
                    enabledByDefault: true
                },
                {
                    type: "price_drops",
                    description: "Notifications for price drops on wishlist items",
                    enabledByDefault: true
                },
                {
                    type: "new_listings",
                    description: "Alerts for new listings in your preferred categories",
                    enabledByDefault: false
                },
                {
                    type: "promotions",
                    description: "Special offers and platform promotions",
                    enabledByDefault: false
                }
            ],
            preferences: [
                "Customize notification sounds",
                "Set quiet hours to avoid notifications",
                "Choose notification priority levels",
                "Enable/disable specific notification types"
            ],
            tips: [
                "Push notifications work even when the app is closed",
                "You can manage notifications in your device settings",
                "Battery optimization may affect notification delivery",
                "Notifications sync across all your devices"
            ]
        };
    };
    /**
     * Implement offline capabilities for basic assistance
     * @param context Current user context
     * @returns Offline assistance capabilities
     */
    RenAIService.prototype.getOfflineCapabilities = function (context) {
        return {
            availableFeatures: [
                "View previously loaded listings",
                "Access saved wishlist items",
                "Review booking history",
                "See messaging history",
                "Access basic account information"
            ],
            limitations: [
                "Cannot search for new listings",
                "Cannot send new messages",
                "Cannot make bookings or payments",
                "Cannot update profile information",
                "Cannot list new items"
            ],
            synchronization: [
                "Changes automatically sync when connection is restored",
                "Offline data is stored securely on your device",
                "Up to 30 days of data can be stored offline",
                "Large images and files are not cached offline"
            ],
            tips: [
                "Enable offline mode in settings for better performance",
                "Download important information before going offline",
                "Bookmark key pages for easy offline access",
                "Data is encrypted and secure on your device"
            ]
        };
    };
    /**
     * Get reminders for upcoming bookings or return dates
     * @param userId The user ID to get reminders for
     * @returns Array of booking reminders
     */
    RenAIService.prototype.getBookingReminders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var reminders, upcomingBookings, endingBookings, _i, upcomingBookings_2, booking, timeUntilStart, _a, endingBookings_2, booking, timeUntilEnd, error_16;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reminders = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    startDate: {
                                        gte: new Date(),
                                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
                                    },
                                    status: 'confirmed'
                                },
                                include: {
                                    listing: {
                                        select: {
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    startDate: 'asc'
                                }
                            })];
                    case 2:
                        upcomingBookings = _b.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    endDate: {
                                        gte: new Date(),
                                        lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Next 2 days
                                    },
                                    status: 'confirmed'
                                },
                                include: {
                                    listing: {
                                        select: {
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    endDate: 'asc'
                                }
                            })];
                    case 3:
                        endingBookings = _b.sent();
                        // Create pickup reminders
                        for (_i = 0, upcomingBookings_2 = upcomingBookings; _i < upcomingBookings_2.length; _i++) {
                            booking = upcomingBookings_2[_i];
                            timeUntilStart = Math.ceil((booking.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            if (timeUntilStart <= 1) {
                                reminders.push({
                                    type: "pickup_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" starts tomorrow. Don't forget to pick it up!"),
                                    bookingId: booking.id,
                                    priority: 9,
                                    timeUntilEvent: "".concat(timeUntilStart, " day").concat(timeUntilStart !== 1 ? 's' : '')
                                });
                            }
                            else if (timeUntilStart <= 3) {
                                reminders.push({
                                    type: "pickup_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" starts in ").concat(timeUntilStart, " days. Plan accordingly!"),
                                    bookingId: booking.id,
                                    priority: 8,
                                    timeUntilEvent: "".concat(timeUntilStart, " days")
                                });
                            }
                        }
                        // Create return reminders
                        for (_a = 0, endingBookings_2 = endingBookings; _a < endingBookings_2.length; _a++) {
                            booking = endingBookings_2[_a];
                            timeUntilEnd = Math.ceil((booking.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            if (timeUntilEnd <= 1) {
                                reminders.push({
                                    type: "return_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" is due tomorrow. Don't forget to return it!"),
                                    bookingId: booking.id,
                                    priority: 10,
                                    timeUntilEvent: "".concat(timeUntilEnd, " day").concat(timeUntilEnd !== 1 ? 's' : '')
                                });
                            }
                            else if (timeUntilEnd <= 2) {
                                reminders.push({
                                    type: "return_reminder",
                                    message: "Reminder: Your rental \"".concat(booking.listing.title, "\" is due in ").concat(timeUntilEnd, " days. Prepare for return!"),
                                    bookingId: booking.id,
                                    priority: 8,
                                    timeUntilEvent: "".concat(timeUntilEnd, " day").concat(timeUntilEnd !== 1 ? 's' : '')
                                });
                            }
                        }
                        // Sort reminders by priority
                        return [2 /*return*/, reminders.sort(function (a, b) { return b.priority - a.priority; })];
                    case 4:
                        error_16 = _b.sent();
                        console.error('Error getting booking reminders:', error_16);
                        return [2 /*return*/, reminders];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate personalized recommendations for a user
     * @param userId The user ID to generate recommendations for
     * @returns Array of recommended listings
     */
    RenAIService.prototype.generateRecommendations = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, categories, recommendations, enrichedRecommendations, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: { listing: true }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        if (!(userBookings.length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTrendingListings()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        categories = userBookings.map(function (booking) { return booking.listing.description; });
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    description: {
                                        in: categories
                                    }
                                },
                                take: 5,
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 4:
                        recommendations = _a.sent();
                        enrichedRecommendations = recommendations.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        });
                        return [2 /*return*/, enrichedRecommendations];
                    case 5:
                        error_17 = _a.sent();
                        console.error('Error generating recommendations:', error_17);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate contextual suggestions based on user activity (public method)
     * @param context Current user context
     * @returns Array of contextual suggestions
     */
    RenAIService.prototype.generateContextualSuggestions = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContextualSuggestions(context)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Help users modify or cancel bookings
     * @param userId The user ID
     * @param context Current user context
     * @returns Array of booking modification assistance suggestions
     */
    RenAIService.prototype.getBookingModificationAssistance = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var assistance, upcomingBookings, _i, upcomingBookings_3, booking, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assistance = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    startDate: {
                                        gte: new Date()
                                    },
                                    status: {
                                        in: ['pending', 'confirmed', 'active']
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            price: true
                                        }
                                    }
                                },
                                orderBy: {
                                    startDate: 'asc'
                                }
                            })];
                    case 2:
                        upcomingBookings = _a.sent();
                        // Add modification options for each booking
                        for (_i = 0, upcomingBookings_3 = upcomingBookings; _i < upcomingBookings_3.length; _i++) {
                            booking = upcomingBookings_3[_i];
                            assistance.push({
                                type: "modify_booking",
                                message: "Modify booking: \"".concat(booking.listing.title, "\" (\u20B1").concat(booking.listing.price, "/day) starting ").concat(booking.startDate.toDateString()),
                                bookingId: booking.id,
                                priority: 8
                            });
                            assistance.push({
                                type: "cancel_booking",
                                message: "Cancel booking: \"".concat(booking.listing.title, "\" starting ").concat(booking.startDate.toDateString()),
                                bookingId: booking.id,
                                priority: 7
                            });
                        }
                        // Add general modification help
                        assistance.push({
                            type: "booking_help",
                            message: "Need help with modifying or canceling a booking? I can guide you through the process.",
                            priority: 5
                        });
                        // Sort by priority
                        return [2 /*return*/, assistance.sort(function (a, b) { return b.priority - a.priority; })];
                    case 3:
                        error_18 = _a.sent();
                        console.error('Error getting booking modification assistance:', error_18);
                        return [2 /*return*/, assistance];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Provide booking status updates
     * @param userId The user ID
     * @param context Current user context
     * @returns Array of booking status updates
     */
    RenAIService.prototype.getBookingStatusUpdates = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, recentBookings, _i, recentBookings_1, booking, statusMessages, statusMessage, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    updatedAt: {
                                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                },
                                orderBy: {
                                    updatedAt: 'desc'
                                }
                            })];
                    case 2:
                        recentBookings = _a.sent();
                        // Add status updates
                        for (_i = 0, recentBookings_1 = recentBookings; _i < recentBookings_1.length; _i++) {
                            booking = recentBookings_1[_i];
                            statusMessages = {
                                'pending': 'is awaiting confirmation from the owner',
                                'confirmed': 'has been confirmed by the owner',
                                'active': 'is currently active',
                                'completed': 'has been completed',
                                'cancelled': 'has been cancelled',
                                'rejected': 'has been rejected by the owner'
                            };
                            statusMessage = statusMessages[booking.status] || 'status has been updated';
                            updates.push({
                                type: "booking_status",
                                message: "Your booking for \"".concat(booking.listing.title, "\" ").concat(statusMessage),
                                bookingId: booking.id,
                                priority: 8
                            });
                        }
                        // Add general booking status help
                        updates.push({
                            type: "booking_status_help",
                            message: "Want to check the status of a specific booking? I can help you find it.",
                            priority: 5
                        });
                        // Sort by priority
                        return [2 /*return*/, updates.sort(function (a, b) { return b.priority - a.priority; })];
                    case 3:
                        error_19 = _a.sent();
                        console.error('Error getting booking status updates:', error_19);
                        return [2 /*return*/, updates];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Assist with rescheduling when conflicts arise
     * @param userId The user ID
     * @param context Current user context
     * @returns Array of rescheduling assistance suggestions
     */
    RenAIService.prototype.getReschedulingAssistance = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var assistance, upcomingBookings, _i, upcomingBookings_4, booking, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assistance = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    startDate: {
                                        gte: new Date()
                                    },
                                    status: {
                                        in: ['pending', 'confirmed', 'active']
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            price: true
                                        }
                                    }
                                },
                                orderBy: {
                                    startDate: 'asc'
                                }
                            })];
                    case 2:
                        upcomingBookings = _a.sent();
                        // Add rescheduling options
                        for (_i = 0, upcomingBookings_4 = upcomingBookings; _i < upcomingBookings_4.length; _i++) {
                            booking = upcomingBookings_4[_i];
                            assistance.push({
                                type: "reschedule_booking",
                                message: "Reschedule booking: \"".concat(booking.listing.title, "\" (\u20B1").concat(booking.listing.price, "/day)"),
                                bookingId: booking.id,
                                priority: 8
                            });
                        }
                        // Add general rescheduling help
                        assistance.push({
                            type: "reschedule_help",
                            message: "Having a scheduling conflict? I can help you reschedule your booking to different dates.",
                            priority: 6
                        });
                        // Sort by priority
                        return [2 /*return*/, assistance.sort(function (a, b) { return b.priority - a.priority; })];
                    case 3:
                        error_20 = _a.sent();
                        console.error('Error getting rescheduling assistance:', error_20);
                        return [2 /*return*/, assistance];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Explain payment methods and security measures
     * @param context Current user context
     * @returns Payment information and security details
     */
    RenAIService.prototype.getPaymentInformation = function (context) {
        return {
            paymentMethods: [
                {
                    name: "Credit/Debit Card",
                    description: "Secure payment through our PCI-compliant payment processor",
                    security: "All card information is encrypted and processed securely"
                },
                {
                    name: "Bank Transfer",
                    description: "Direct bank transfers for secure payments",
                    security: "Bank-level encryption and fraud protection"
                },
                {
                    name: "E-Wallet",
                    description: "Digital wallet payments for convenience",
                    security: "Two-factor authentication and transaction monitoring"
                }
            ],
            securityMeasures: [
                "End-to-end encryption for all payment data",
                "PCI DSS compliance for card transactions",
                "Fraud detection and prevention systems",
                "Secure payment holding until rental completion",
                "Refund protection policies"
            ],
            tips: [
                "Always verify the item and owner details before confirming payment",
                "Keep all payment receipts and communication records",
                "Report any suspicious activity immediately",
                "Use our secure messaging system for all communication"
            ]
        };
    };
    /**
     * Help troubleshoot payment issues
     * @param context Current user context
     * @returns Array of payment troubleshooting suggestions
     */
    RenAIService.prototype.getPaymentTroubleshooting = function (context) {
        return [
            {
                type: "card_declined",
                message: "Card declined? Check if your card has sufficient funds or contact your bank.",
                priority: 9
            },
            {
                type: "payment_failed",
                message: "Payment failed? Try a different payment method or check your internet connection.",
                priority: 8
            },
            {
                type: "transaction_pending",
                message: "Transaction pending? This may take a few minutes. Please wait and check back.",
                priority: 7
            },
            {
                type: "refund_issue",
                message: "Having issues with a refund? Contact our support team with your transaction details.",
                priority: 6
            },
            {
                type: "payment_help",
                message: "Need help with payments? I can guide you through the process step by step.",
                priority: 5
            }
        ].sort(function (a, b) { return b.priority - a.priority; });
    };
    /**
     * Provide payment history and transaction details
     * @param userId The user ID
     * @param context Current user context
     * @returns Payment history and transaction details
     */
    RenAIService.prototype.getPaymentHistory = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions, totalSpent, totalEarned, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.transaction.findMany({
                                where: {
                                    userId: userId
                                },
                                include: {
                                    booking: {
                                        include: {
                                            listing: {
                                                select: {
                                                    title: true
                                                }
                                            }
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                take: 10
                            })];
                    case 1:
                        transactions = _a.sent();
                        totalSpent = transactions
                            .filter(function (t) { return t.amount > 0; })
                            .reduce(function (sum, transaction) { return sum + transaction.amount; }, 0);
                        totalEarned = transactions
                            .filter(function (t) { return t.amount < 0; }) // Assuming negative amounts represent earnings
                            .reduce(function (sum, transaction) { return sum + Math.abs(transaction.amount); }, 0);
                        return [2 /*return*/, {
                                transactions: transactions.map(function (t) {
                                    var _a, _b;
                                    return ({
                                        id: t.id,
                                        amount: t.amount,
                                        currency: t.currency,
                                        paymentMethod: t.paymentMethod,
                                        status: t.status,
                                        createdAt: t.createdAt,
                                        itemName: ((_b = (_a = t.booking) === null || _a === void 0 ? void 0 : _a.listing) === null || _b === void 0 ? void 0 : _b.title) || 'Unknown item',
                                        type: t.amount > 0 ? 'payment' : 'earning'
                                    });
                                }),
                                summary: {
                                    totalSpent: totalSpent,
                                    totalEarned: totalEarned,
                                    netBalance: totalEarned - totalSpent,
                                    transactionCount: transactions.length
                                }
                            }];
                    case 2:
                        error_21 = _a.sent();
                        console.error('Error getting payment history:', error_21);
                        return [2 /*return*/, {
                                transactions: [],
                                summary: {
                                    totalSpent: 0,
                                    totalEarned: 0,
                                    netBalance: 0,
                                    transactionCount: 0
                                }
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Guide users on leaving helpful reviews
     * @param context Current user context
     * @returns Review guidelines and tips
     */
    RenAIService.prototype.getReviewGuidelines = function (context) {
        return {
            guidelines: [
                "Be honest and specific about your experience",
                "Mention both positive aspects and areas for improvement",
                "Focus on the item and rental process, not personal opinions about the owner",
                "Include details about item condition, accuracy of description, and communication",
                "Be respectful and constructive in your feedback"
            ],
            tips: [
                "Include photos if they help illustrate your review",
                "Mention if the item arrived as described",
                "Comment on the owner's responsiveness and helpfulness",
                "Rate based on your actual experience, not expectations",
                "Keep reviews recent and relevant"
            ],
            ratingCriteria: [
                "1 star: Poor experience, significant issues",
                "2 stars: Below average, some problems",
                "3 stars: Average experience, met basic expectations",
                "4 stars: Good experience, minor issues",
                "5 stars: Excellent experience, exceeded expectations"
            ]
        };
    };
    /**
     * Suggest items to review based on recent rentals
     * @param userId The user ID
     * @param context Current user context
     * @returns Array of items to review
     */
    RenAIService.prototype.getSuggestedReviews = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions, recentBookings, bookingsWithoutReviews, _i, bookingsWithoutReviews_1, booking, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        suggestions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    status: 'completed',
                                    endDate: {
                                        lte: new Date()
                                    },
                                    startDate: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    },
                                    reviews: true
                                },
                                orderBy: {
                                    endDate: 'desc'
                                }
                            })];
                    case 2:
                        recentBookings = _a.sent();
                        bookingsWithoutReviews = recentBookings.filter(function (booking) { return booking.reviews.length === 0; });
                        // Add suggestions
                        for (_i = 0, bookingsWithoutReviews_1 = bookingsWithoutReviews; _i < bookingsWithoutReviews_1.length; _i++) {
                            booking = bookingsWithoutReviews_1[_i];
                            suggestions.push({
                                type: "review_suggestion",
                                message: "How was your experience with \"".concat(booking.listing.title, "\"? Leave a review to help other renters."),
                                listingId: booking.listing.id,
                                bookingId: booking.id,
                                priority: 8
                            });
                        }
                        // Add general review help
                        suggestions.push({
                            type: "review_help",
                            message: "Want to leave a review? I can guide you through the process.",
                            priority: 5
                        });
                        // Sort by priority
                        return [2 /*return*/, suggestions.sort(function (a, b) { return b.priority - a.priority; })];
                    case 3:
                        error_22 = _a.sent();
                        console.error('Error getting suggested reviews:', error_22);
                        return [2 /*return*/, suggestions];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Help resolve disputes through mediation suggestions
     * @param context Current user context
     * @returns Dispute resolution guidance
     */
    RenAIService.prototype.getDisputeResolutionGuidance = function (context) {
        return {
            steps: [
                "Document all communication and evidence related to the dispute",
                "Try to resolve the issue directly with the other party through our messaging system",
                "If direct communication fails, submit a dispute report through our support system",
                "Provide clear details about the issue and any relevant evidence",
                "Our mediation team will review the case and contact both parties",
                "Follow the mediator's guidance to reach a fair resolution"
            ],
            whenToEscalate: [
                "Safety concerns or threats",
                "Significant item damage or misrepresentation",
                "Payment disputes or fraud",
                "Non-communication after multiple attempts",
                "Violation of platform policies"
            ],
            tips: [
                "Keep all messages and photos as evidence",
                "Be respectful and factual in your communication",
                "Respond promptly to mediator requests",
                "Be open to compromise for mutual benefit",
                "Follow platform guidelines throughout the process"
            ]
        };
    };
    /**
     * System monitoring superpower - scans codebase for issues
     * This is a placeholder for the actual implementation that would integrate with GitHub
     */
    RenAIService.prototype.scanCodebaseForIssues = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real implementation, this would:
                // 1. Connect to GitHub API
                // 2. Scan repository files for common issues
                // 3. Analyze code quality metrics
                // 4. Identify potential bugs and security vulnerabilities
                // 5. Generate reports and suggestions
                return [2 /*return*/, {
                        issues: [],
                        suggestions: [
                            "Code scanning feature will be implemented to continuously monitor the codebase for improvements and potential issues."
                        ]
                    }];
            });
        });
    };
    /**
     * Get nearby locations based on a given location using geolocation data
     * @param location The base location
     * @param userLat User's latitude (if available)
     * @param userLng User's longitude (if available)
     * @returns Array of nearby locations
     */
    RenAIService.prototype.getNearbyLocations = function (location, userLat, userLng) {
        return __awaiter(this, void 0, void 0, function () {
            var philippinesCities, referenceLocation_1, distances, nearbyLocationsMap, nearbyLocationsMap;
            return __generator(this, function (_a) {
                try {
                    // If we have user's geolocation data, use it to find nearby locations
                    if (userLat !== undefined && userLng !== undefined) {
                        philippinesCities = [
                            { name: "Manila", lat: 14.5995, lng: 120.9842 },
                            { name: "Makati", lat: 14.5547, lng: 121.0244 },
                            { name: "Taguig", lat: 14.5176, lng: 121.0509 },
                            { name: "Pasay", lat: 14.5375, lng: 121.0014 },
                            { name: "Quezon City", lat: 14.6379, lng: 121.0434 },
                            { name: "Caloocan", lat: 14.7569, lng: 120.9812 },
                            { name: "Mandaluyong", lat: 14.5832, lng: 121.0409 },
                            { name: "Marikina", lat: 14.6419, lng: 121.1004 },
                            { name: "Pasig", lat: 14.5866, lng: 121.0604 },
                            { name: "San Juan", lat: 14.5995, lng: 121.0359 },
                            { name: "Cebu City", lat: 10.3157, lng: 123.8854 },
                            { name: "Mandaue", lat: 10.3234, lng: 123.9294 },
                            { name: "Lapu-Lapu", lat: 10.2988, lng: 123.9669 },
                            { name: "Davao City", lat: 7.1907, lng: 125.4553 },
                            { name: "Iloilo City", lat: 10.7202, lng: 122.5621 }
                        ];
                        referenceLocation_1 = philippinesCities.find(function (city) {
                            return city.name.toLowerCase() === location.toLowerCase();
                        });
                        if (referenceLocation_1) {
                            distances = philippinesCities
                                .filter(function (city) { return city.name.toLowerCase() !== location.toLowerCase(); })
                                .map(function (city) { return ({
                                name: city.name,
                                distance: Math.sqrt(Math.pow(city.lat - referenceLocation_1.lat, 2) +
                                    Math.pow(city.lng - referenceLocation_1.lng, 2))
                            }); })
                                .sort(function (a, b) { return a.distance - b.distance; })
                                .slice(0, 5) // Return top 5 nearest locations
                                .map(function (city) { return city.name; });
                            return [2 /*return*/, distances];
                        }
                    }
                    nearbyLocationsMap = {
                        "Manila": ["Makati", "Taguig", "Pasay", "Quezon City", "Caloocan"],
                        "Makati": ["Manila", "Taguig", "Pasay", "Quezon City", "Mandaluyong"],
                        "Taguig": ["Manila", "Makati", "Pasay", "Mandaluyong", "Pasig"],
                        "Quezon City": ["Manila", "Makati", "Caloocan", "San Juan", "Mandaluyong"],
                        "Pasig": ["Manila", "Makati", "Taguig", "Mandaluyong", "Marikina"],
                        "Cebu City": ["Mandaue", "Lapu-Lapu", "Talisay", "Naga", "Toledo"],
                        "Davao City": ["Davao del Sur", "Davao Oriental", "Davao de Oro", "Tagum", "Panabo"],
                        "Iloilo City": ["Iloilo", "Passi", "Santa Barbara", "Tigbauan", "Pototan"]
                    };
                    return [2 /*return*/, nearbyLocationsMap[location] || []];
                }
                catch (error) {
                    console.error('Error getting nearby locations:', error);
                    nearbyLocationsMap = {
                        "Manila": ["Makati", "Taguig", "Pasay", "Quezon City", "Caloocan"],
                        "Makati": ["Manila", "Taguig", "Pasay", "Quezon City", "Mandaluyong"],
                        "Taguig": ["Manila", "Makati", "Pasay", "Mandaluyong", "Pasig"],
                        "Quezon City": ["Manila", "Makati", "Caloocan", "San Juan", "Mandaluyong"],
                        "Pasig": ["Manila", "Makati", "Taguig", "Mandaluyong", "Marikina"],
                        "Cebu City": ["Mandaue", "Lapu-Lapu", "Talisay", "Naga", "Toledo"],
                        "Davao City": ["Davao del Sur", "Davao Oriental", "Davao de Oro", "Tagum", "Panabo"],
                        "Iloilo City": ["Iloilo", "Passi", "Santa Barbara", "Tigbauan", "Pototan"]
                    };
                    return [2 /*return*/, nearbyLocationsMap[location] || []];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get user's calendar events for rental suggestions
     * @param userId The user ID to get calendar events for
     * @returns Array of calendar events
     */
    RenAIService.prototype.getUserCalendarEvents = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, calendarEvents, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            title: true,
                                            description: true,
                                            category: true,
                                            location: true
                                        }
                                    }
                                },
                                orderBy: { startDate: 'asc' }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        calendarEvents = userBookings.map(function (booking) { return ({
                            id: booking.id,
                            title: "Rent: ".concat(booking.listing.title),
                            start: booking.startDate,
                            end: booking.endDate,
                            description: booking.listing.description,
                            location: booking.listing.location,
                            category: booking.listing.category || 'rental'
                        }); });
                        return [2 /*return*/, calendarEvents];
                    case 2:
                        error_23 = _a.sent();
                        console.error('Error getting user calendar events:', error_23);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get rental suggestions based on calendar events
     * @param userId The user ID to get suggestions for
     * @param context Current AI context
     * @returns Array of rental suggestions based on calendar events
     */
    RenAIService.prototype.getCalendarBasedSuggestions = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions, calendarEvents, persona, now_1, nextWeek_1, upcomingEvents, _i, upcomingEvents_1, event_1, eventText, eventType, category, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        suggestions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getUserCalendarEvents(userId)];
                    case 2:
                        calendarEvents = _a.sent();
                        if (calendarEvents.length === 0) {
                            return [2 /*return*/, suggestions];
                        }
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 3:
                        persona = _a.sent();
                        if (!persona) {
                            return [2 /*return*/, suggestions];
                        }
                        now_1 = new Date();
                        nextWeek_1 = new Date();
                        nextWeek_1.setDate(now_1.getDate() + 7);
                        upcomingEvents = calendarEvents.filter(function (event) {
                            return event.start >= now_1 && event.start <= nextWeek_1;
                        });
                        // For each upcoming event, suggest relevant rentals
                        for (_i = 0, upcomingEvents_1 = upcomingEvents; _i < upcomingEvents_1.length; _i++) {
                            event_1 = upcomingEvents_1[_i];
                            eventText = "".concat(event_1.title, " ").concat(event_1.description || '').toLowerCase();
                            eventType = 'general';
                            if (eventText.includes('wedding') || eventText.includes('reception')) {
                                eventType = 'wedding';
                            }
                            else if (eventText.includes('birthday') || eventText.includes('party')) {
                                eventType = 'party';
                            }
                            else if (eventText.includes('camping') || eventText.includes('hiking')) {
                                eventType = 'outdoor';
                            }
                            else if (eventText.includes('conference') || eventText.includes('meeting')) {
                                eventType = 'business';
                            }
                            else if (eventText.includes('beach') || eventText.includes('pool')) {
                                eventType = 'beach';
                            }
                            // Suggest rentals based on event type
                            switch (eventType) {
                                case 'wedding':
                                    suggestions.push({
                                        type: "calendar_suggestion",
                                        message: "Upcoming wedding: Consider renting party decorations, sound systems, or photography equipment for your event on ".concat(event_1.start.toLocaleDateString()),
                                        priority: 9
                                    });
                                    break;
                                case 'party':
                                    suggestions.push({
                                        type: "calendar_suggestion",
                                        message: "Upcoming party: Consider renting party supplies, sound systems, or serving equipment for your event on ".concat(event_1.start.toLocaleDateString()),
                                        priority: 8
                                    });
                                    break;
                                case 'outdoor':
                                    suggestions.push({
                                        type: "calendar_suggestion",
                                        message: "Upcoming outdoor activity: Consider renting camping gear, sports equipment, or outdoor cooking supplies for your event on ".concat(event_1.start.toLocaleDateString()),
                                        priority: 8
                                    });
                                    break;
                                case 'business':
                                    suggestions.push({
                                        type: "calendar_suggestion",
                                        message: "Upcoming business event: Consider renting presentation equipment, office supplies, or professional attire for your event on ".concat(event_1.start.toLocaleDateString()),
                                        priority: 7
                                    });
                                    break;
                                case 'beach':
                                    suggestions.push({
                                        type: "calendar_suggestion",
                                        message: "Upcoming beach day: Consider renting beach chairs, umbrellas, or water sports equipment for your event on ".concat(event_1.start.toLocaleDateString()),
                                        priority: 8
                                    });
                                    break;
                                default:
                                    // For general events, suggest based on user's rental history
                                    if (persona.favoriteCategories.length > 0) {
                                        category = persona.favoriteCategories[0];
                                        suggestions.push({
                                            type: "calendar_suggestion",
                                            message: "Upcoming event: Consider renting ".concat(category, " items for your event on ").concat(event_1.start.toLocaleDateString()),
                                            priority: 6
                                        });
                                    }
                                    else {
                                        suggestions.push({
                                            type: "calendar_suggestion",
                                            message: "Upcoming event: Browse rentals for your event on ".concat(event_1.start.toLocaleDateString()),
                                            priority: 5
                                        });
                                    }
                            }
                        }
                        // Sort suggestions by priority
                        return [2 /*return*/, suggestions.sort(function (a, b) { return b.priority - a.priority; })];
                    case 4:
                        error_24 = _a.sent();
                        console.error('Error getting calendar-based suggestions:', error_24);
                        return [2 /*return*/, suggestions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate contextual suggestions based on user activity
     * @param context Current user context
     * @returns Array of contextual suggestions
     */
    RenAIService.prototype.getContextualSuggestions = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions, recentRental, upcomingEvents, nextEvent, preferredLocation, nearbyLocations, currentMonth, currentDate, userPreferredCategories, userPreferences, error_25, seasonalItems, monthSuggestions, bestSeasonalSuggestion, highestMatchScore, _i, monthSuggestions_1, suggestion, matchScore, _loop_1, _a, _b, category, recentBookings, wishlistCount, unreadMessages, currentHour, currentDay, userPreferredHours, userPreferredDays, userPreferences, error_26, calendarSuggestions, actions, viewActions, searchActions, bookingRelatedActions, listingRelatedActions, recentActions, startedBooking, completedBooking, startedListing, completedListing, workflow, step, userBookings, userListings, lastBooking, lastCategory_1, complementaryItems, categoryKey, items, lastListing, lastCategory, maintenanceRecommendations, seasonalSuggestions;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            return __generator(this, function (_z) {
                switch (_z.label) {
                    case 0:
                        suggestions = [];
                        // Use inferred preferences if available
                        if (context.inferredPreferences) {
                            // Suggest based on preferred categories
                            if ((_c = context.inferredPreferences.preferredCategories) === null || _c === void 0 ? void 0 : _c.length) {
                                suggestions.push("Find more ".concat(context.inferredPreferences.preferredCategories[0], " rentals"));
                            }
                            // Suggest based on preferred locations
                            if ((_d = context.inferredPreferences.preferredLocations) === null || _d === void 0 ? void 0 : _d.length) {
                                suggestions.push("Find rentals in ".concat(context.inferredPreferences.preferredLocations[0]));
                            }
                            // Suggest based on engagement level
                            if (context.inferredPreferences.engagementLevel === 'high') {
                                suggestions.push("You're a frequent renter! Consider listing your own items");
                            }
                            else if (context.inferredPreferences.engagementLevel === 'low') {
                                suggestions.push("New to renting? Check out our beginner's guide");
                            }
                        }
                        // If user is on browse page, suggest search filters
                        if ((_f = (_e = context.userPreferences) === null || _e === void 0 ? void 0 : _e.categories) === null || _f === void 0 ? void 0 : _f.length) {
                            suggestions.push("Find more ".concat(context.userPreferences.categories[0], " rentals"));
                        }
                        // Personalized suggestions based on user profile
                        if (context.userProfile) {
                            // Suggest based on favorite categories
                            if ((_g = context.userProfile.favoriteCategories) === null || _g === void 0 ? void 0 : _g.length) {
                                suggestions.push("Find more ".concat(context.userProfile.favoriteCategories[0], " items"));
                            }
                            // Suggest based on rental history
                            if ((_h = context.userProfile.rentalHistory) === null || _h === void 0 ? void 0 : _h.length) {
                                recentRental = context.userProfile.rentalHistory[context.userProfile.rentalHistory.length - 1];
                                suggestions.push("Rent similar items");
                                suggestions.push("Leave a review for your recent rental");
                            }
                            // Suggest based on listed items
                            if ((_j = context.userProfile.listedItems) === null || _j === void 0 ? void 0 : _j.length) {
                                suggestions.push("View my listings");
                                suggestions.push("Check listing performance");
                            }
                            // Calendar-based suggestions
                            if ((_k = context.userProfile.calendarEvents) === null || _k === void 0 ? void 0 : _k.length) {
                                upcomingEvents = context.userProfile.calendarEvents.filter(function (event) {
                                    return event.start >= new Date();
                                });
                                if (upcomingEvents.length > 0) {
                                    nextEvent = upcomingEvents[0];
                                    suggestions.push("Prepare for ".concat(nextEvent.title, " on ").concat(nextEvent.start.toLocaleDateString()));
                                }
                            }
                        }
                        // Location-based suggestions using geolocation data
                        if (context.currentLocation) {
                            suggestions.push("Find rentals near ".concat(context.currentLocation));
                        }
                        if ((_m = (_l = context.userPreferences) === null || _l === void 0 ? void 0 : _l.locations) === null || _m === void 0 ? void 0 : _m.length) {
                            suggestions.push("Find rentals in ".concat(context.userPreferences.locations[0]));
                        }
                        if (!((_p = (_o = context.userProfile) === null || _o === void 0 ? void 0 : _o.preferredLocations) === null || _p === void 0 ? void 0 : _p.length)) return [3 /*break*/, 2];
                        preferredLocation = context.userProfile.preferredLocations[0];
                        suggestions.push("Find rentals in ".concat(preferredLocation));
                        return [4 /*yield*/, this.getNearbyLocations(preferredLocation, (_q = context.currentGeolocation) === null || _q === void 0 ? void 0 : _q.latitude, (_r = context.currentGeolocation) === null || _r === void 0 ? void 0 : _r.longitude)];
                    case 1:
                        nearbyLocations = _z.sent();
                        if (nearbyLocations.length > 0) {
                            suggestions.push("Find rentals near ".concat(nearbyLocations[0]));
                        }
                        _z.label = 2;
                    case 2:
                        currentMonth = new Date().getMonth();
                        currentDate = new Date();
                        userPreferredCategories = [];
                        if (!context.userId) return [3 /*break*/, 6];
                        _z.label = 3;
                    case 3:
                        _z.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.getUserPreferences(context.userId)];
                    case 4:
                        userPreferences = _z.sent();
                        userPreferredCategories = userPreferences.preferredCategories || [];
                        return [3 /*break*/, 6];
                    case 5:
                        error_25 = _z.sent();
                        console.error('Error getting user preferences for seasonal suggestions:', error_25);
                        return [3 /*break*/, 6];
                    case 6:
                        seasonalItems = {
                            0: [
                                { item: "Party supplies for New Year celebrations", categories: ["party", "celebration", "event"] },
                                { item: "Fitness equipment for New Year resolutions", categories: ["sports", "fitness", "health"] },
                                { item: "Winter clothing and accessories", categories: ["clothing", "fashion", "winter"] }
                            ],
                            1: [
                                { item: "Valentine's Day gifts and decorations", categories: ["gift", "decoration", "romance"] },
                                { item: "Romantic dinner setup items", categories: ["kitchen", "dining", "romance"] },
                                { item: "Couples activities and games", categories: ["game", "entertainment", "romance"] }
                            ],
                            2: [
                                { item: "Gardening tools for spring planting", categories: ["garden", "outdoor", "tool"] },
                                { item: "Spring cleaning supplies", categories: ["cleaning", "home", "utility"] },
                                { item: "Easter party items", categories: ["party", "celebration", "event"] }
                            ],
                            3: [
                                { item: "Umbrellas and rain gear for rainy season", categories: ["weather", "outdoor", "utility"] },
                                { item: "Summer sports equipment", categories: ["sports", "outdoor", "recreation"] },
                                { item: "Grilling and BBQ equipment", categories: ["kitchen", "outdoor", "cooking"] }
                            ],
                            4: [
                                { item: "Beach and swimming gear", categories: ["beach", "swimming", "outdoor"] },
                                { item: "Summer party supplies", categories: ["party", "celebration", "event"] },
                                { item: "Outdoor cooking equipment", categories: ["kitchen", "outdoor", "cooking"] }
                            ],
                            5: [
                                { item: "Independence Day decorations", categories: ["decoration", "celebration", "event"] },
                                { item: "Summer vacation rentals", categories: ["travel", "outdoor", "recreation"] },
                                { item: "School supplies", categories: ["education", "office", "study"] }
                            ],
                            6: [
                                { item: "Back-to-school supplies", categories: ["education", "office", "study"] },
                                { item: "Study aids and learning tools", categories: ["education", "study", "technology"] },
                                { item: "Back-to-school clothing", categories: ["clothing", "fashion", "school"] }
                            ],
                            7: [
                                { item: "Rain gear and waterproof items", categories: ["weather", "outdoor", "utility"] },
                                { item: "Indoor entertainment", categories: ["game", "entertainment", "home"] },
                                { item: "Home improvement tools", categories: ["home", "tool", "utility"] }
                            ],
                            8: [
                                { item: "Harvest celebration items", categories: ["celebration", "event", "decoration"] },
                                { item: "Fall gardening tools", categories: ["garden", "outdoor", "tool"] },
                                { item: "Preservation equipment", categories: ["kitchen", "food", "utility"] }
                            ],
                            9: [
                                { item: "Halloween costumes and accessories", categories: ["costume", "celebration", "fashion"] },
                                { item: "Halloween decorations", categories: ["decoration", "celebration", "event"] },
                                { item: "Horror movie equipment", categories: ["entertainment", "media", "technology"] }
                            ],
                            10: [
                                { item: "Thanksgiving dinner supplies", categories: ["kitchen", "dining", "cooking"] },
                                { item: "Family gathering items", categories: ["party", "celebration", "event"] },
                                { item: "All Saints' Day decorations", categories: ["decoration", "celebration", "event"] }
                            ],
                            11: [
                                { item: "Christmas decorations", categories: ["decoration", "celebration", "event"] },
                                { item: "Holiday party supplies", categories: ["party", "celebration", "event"] },
                                { item: "Gift wrapping materials", categories: ["gift", "party", "utility"] }
                            ]
                        };
                        monthSuggestions = seasonalItems[currentMonth] || [];
                        bestSeasonalSuggestion = null;
                        highestMatchScore = 0;
                        // If user has preferred categories, find the best match
                        if (userPreferredCategories.length > 0) {
                            for (_i = 0, monthSuggestions_1 = monthSuggestions; _i < monthSuggestions_1.length; _i++) {
                                suggestion = monthSuggestions_1[_i];
                                matchScore = 0;
                                _loop_1 = function (category) {
                                    if (userPreferredCategories.some(function (prefCat) {
                                        return prefCat.toLowerCase().includes(category) ||
                                            category.toLowerCase().includes(prefCat.toLowerCase());
                                    })) {
                                        matchScore++;
                                    }
                                };
                                // Calculate match score based on category overlap
                                for (_a = 0, _b = suggestion.categories; _a < _b.length; _a++) {
                                    category = _b[_a];
                                    _loop_1(category);
                                }
                                if (matchScore > highestMatchScore) {
                                    highestMatchScore = matchScore;
                                    bestSeasonalSuggestion = suggestion.item;
                                }
                            }
                        }
                        // If no personalized match found, use the first suggestion
                        if (!bestSeasonalSuggestion && monthSuggestions.length > 0) {
                            bestSeasonalSuggestion = monthSuggestions[0].item;
                        }
                        // Add seasonal suggestion if available
                        if (bestSeasonalSuggestion) {
                            suggestions.push(bestSeasonalSuggestion);
                        }
                        if (!context.userId) return [3 /*break*/, 15];
                        return [4 /*yield*/, prisma.booking.count({
                                where: {
                                    userId: context.userId,
                                    createdAt: {
                                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                                    }
                                }
                            })];
                    case 7:
                        recentBookings = _z.sent();
                        if (recentBookings > 0) {
                            suggestions.push("Check booking status");
                            suggestions.push("Leave a review for recent rentals");
                        }
                        return [4 /*yield*/, prisma.wishlist.count({
                                where: {
                                    userId: context.userId
                                }
                            })];
                    case 8:
                        wishlistCount = _z.sent();
                        if (wishlistCount > 0) {
                            suggestions.push("View my wishlist");
                        }
                        return [4 /*yield*/, prisma.message.count({
                                where: {
                                    receiverId: context.userId,
                                    read: false
                                }
                            })];
                    case 9:
                        unreadMessages = _z.sent();
                        if (unreadMessages > 0) {
                            suggestions.push("Check messages (".concat(unreadMessages, " unread)"));
                        }
                        currentHour = new Date().getHours();
                        currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                        userPreferredHours = [];
                        userPreferredDays = [];
                        if (!context.userId) return [3 /*break*/, 13];
                        _z.label = 10;
                    case 10:
                        _z.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.getUserPreferences(context.userId)];
                    case 11:
                        userPreferences = _z.sent();
                        userPreferredHours = userPreferences.preferredBookingHours || [];
                        userPreferredDays = userPreferences.preferredBookingDays || [];
                        return [3 /*break*/, 13];
                    case 12:
                        error_26 = _z.sent();
                        console.error('Error getting user preferences for time-based suggestions:', error_26);
                        return [3 /*break*/, 13];
                    case 13:
                        // Enhanced time-based suggestions
                        if (userPreferredHours.length > 0 && userPreferredHours.includes(currentHour)) {
                            // User has preferred hours and it's one of them
                            suggestions.push("It's your preferred time to browse rentals!");
                        }
                        else if (currentHour >= 18 && currentHour <= 24) {
                            suggestions.push("List an item for rent");
                        }
                        else if (currentHour >= 9 && currentHour <= 17) {
                            suggestions.push("Browse items for your next project");
                        }
                        // Day-based suggestions
                        if (userPreferredDays.length > 0 && userPreferredDays.includes(currentDay)) {
                            // User has preferred days and it's one of them
                            suggestions.push("It's your preferred ".concat(currentDay, "! Check out new listings."));
                        }
                        // Weekend vs weekday suggestions
                        if (currentDay === 'Saturday' || currentDay === 'Sunday') {
                            suggestions.push("Weekend special: Find party supplies and recreational equipment");
                        }
                        else {
                            suggestions.push("Weekday deals: Find tools and equipment for your projects");
                        }
                        return [4 /*yield*/, this.getCalendarBasedSuggestions(context.userId, context)];
                    case 14:
                        calendarSuggestions = _z.sent();
                        calendarSuggestions.forEach(function (suggestion) {
                            suggestions.push(suggestion.message);
                        });
                        _z.label = 15;
                    case 15:
                        if (!((_s = context.currentSession) === null || _s === void 0 ? void 0 : _s.actionsTaken)) return [3 /*break*/, 18];
                        actions = context.currentSession.actionsTaken;
                        viewActions = actions.filter(function (action) { return action.includes('view_listing'); }).length;
                        if (viewActions >= 3) {
                            suggestions.push("Save items to your wishlist");
                        }
                        searchActions = actions.filter(function (action) { return action.includes('search'); }).length;
                        if (searchActions >= 2) {
                            suggestions.push("Try refining your search with filters");
                        }
                        // If user is on a listing page, suggest related actions
                        if ((_t = context.currentSession.currentPage) === null || _t === void 0 ? void 0 : _t.includes('/listing/')) {
                            suggestions.push("Book this item now");
                            suggestions.push("Ask owner a question");
                        }
                        bookingRelatedActions = actions.filter(function (action) {
                            return action.includes('booking') || action.includes('calendar') || action.includes('date');
                        }).length;
                        listingRelatedActions = actions.filter(function (action) {
                            return action.includes('listing') || action.includes('create') || action.includes('add_item');
                        }).length;
                        // If user is actively looking to book, suggest booking assistance
                        if (bookingRelatedActions >= 2) {
                            suggestions.push("Need help with booking? I can assist you with the process");
                        }
                        // If user is looking to list items, suggest listing assistance
                        if (listingRelatedActions >= 2) {
                            suggestions.push("Need help listing your items? I can guide you through the process");
                        }
                        recentActions = actions.slice(-5);
                        startedBooking = recentActions.some(function (action) { return action.includes('start_booking'); });
                        completedBooking = recentActions.some(function (action) { return action.includes('complete_booking'); });
                        if (startedBooking && !completedBooking) {
                            suggestions.push("Continue your booking process");
                        }
                        startedListing = recentActions.some(function (action) { return action.includes('start_listing'); });
                        completedListing = recentActions.some(function (action) { return action.includes('complete_listing'); });
                        if (startedListing && !completedListing) {
                            suggestions.push("Continue creating your listing");
                        }
                        // Proactive suggestions for next steps in workflows
                        if ((_u = context.conversationState) === null || _u === void 0 ? void 0 : _u.workflow) {
                            workflow = context.conversationState.workflow;
                            step = context.conversationState.step || 0;
                            switch (workflow) {
                                case 'booking':
                                    if (step === 0) {
                                        suggestions.push("Select rental dates");
                                        suggestions.push("Check availability");
                                    }
                                    else if (step === 1) {
                                        suggestions.push("Review booking details");
                                        suggestions.push("Proceed to payment");
                                    }
                                    else if (step === 2) {
                                        suggestions.push("Complete payment");
                                        suggestions.push("View booking confirmation");
                                    }
                                    break;
                                case 'listing':
                                    if (step === 0) {
                                        suggestions.push("Add item details");
                                        suggestions.push("Set rental price");
                                    }
                                    else if (step === 1) {
                                        suggestions.push("Add photos");
                                        suggestions.push("Set availability");
                                    }
                                    else if (step === 2) {
                                        suggestions.push("Review listing");
                                        suggestions.push("Publish listing");
                                    }
                                    break;
                                case 'search':
                                    if (step === 0) {
                                        suggestions.push("Refine search criteria");
                                        suggestions.push("Apply filters");
                                    }
                                    else if (step === 1) {
                                        suggestions.push("Sort results");
                                        suggestions.push("Save to wishlist");
                                    }
                                    break;
                            }
                        }
                        if (!context.userId) return [3 /*break*/, 18];
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: context.userId },
                                include: {
                                    listing: {
                                        select: {
                                            category: true,
                                            title: true
                                        }
                                    }
                                },
                                orderBy: { startDate: 'desc' },
                                take: 5 // Last 5 bookings
                            })];
                    case 16:
                        userBookings = _z.sent();
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: { ownerId: context.userId },
                                select: {
                                    category: true,
                                    title: true
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 5 // Last 5 listings
                            })];
                    case 17:
                        userListings = _z.sent();
                        // Suggest related items based on rental history
                        if (userBookings.length > 0) {
                            lastBooking = userBookings[0];
                            lastCategory_1 = lastBooking.listing.category;
                            if (lastCategory_1) {
                                suggestions.push("Need more ".concat(lastCategory_1, " items?"));
                                suggestions.push("Rent similar items to ".concat(lastBooking.listing.title));
                            }
                            complementaryItems = {
                                'camera': ['tripod', 'lens', 'memory card'],
                                'tool': ['safety equipment', 'storage case', 'accessories'],
                                'party': ['decorations', 'sound system', 'serving equipment'],
                                'sports': ['protective gear', 'accessories', 'training equipment'],
                                'outdoor': ['camping gear', 'safety equipment', 'storage'],
                                'kitchen': ['utensils', 'serving equipment', 'cleaning supplies']
                            };
                            categoryKey = Object.keys(complementaryItems).find(function (key) {
                                return lastCategory_1 === null || lastCategory_1 === void 0 ? void 0 : lastCategory_1.toLowerCase().includes(key);
                            });
                            if (categoryKey) {
                                items = complementaryItems[categoryKey];
                                if (items.length > 0) {
                                    suggestions.push("Need ".concat(items[0], " to go with your ").concat(lastCategory_1, "?"));
                                }
                            }
                        }
                        // Suggest maintenance for listed items
                        if (userListings.length > 0) {
                            lastListing = userListings[0];
                            lastCategory = lastListing.category;
                            if (lastCategory) {
                                suggestions.push("Maintain your ".concat(lastCategory, " items for better rentals"));
                            }
                        }
                        _z.label = 18;
                    case 18:
                        if (!(context.userId && ((_w = (_v = context.userProfile) === null || _v === void 0 ? void 0 : _v.listedItems) === null || _w === void 0 ? void 0 : _w.length))) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.getMaintenanceRecommendations(context.userId)];
                    case 19:
                        maintenanceRecommendations = _z.sent();
                        maintenanceRecommendations.forEach(function (recommendation) {
                            suggestions.push(recommendation.message);
                        });
                        _z.label = 20;
                    case 20:
                        if (!(context.userId && ((_y = (_x = context.userProfile) === null || _x === void 0 ? void 0 : _x.listedItems) === null || _y === void 0 ? void 0 : _y.length))) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.getSeasonalListingSuggestions(context.userId)];
                    case 21:
                        seasonalSuggestions = _z.sent();
                        seasonalSuggestions.forEach(function (suggestion) {
                            suggestions.push(suggestion.message);
                        });
                        _z.label = 22;
                    case 22:
                        // Add general suggestions
                        suggestions.push("Find popular rentals");
                        suggestions.push("View trending items");
                        suggestions.push("Import listings from web");
                        return [2 /*return*/, suggestions.slice(0, 4)]; // Limit to 4 suggestions
                }
            });
        });
    };
    /**
     * Generate user persona based on rental history and behavior
     * @param userId The user ID to generate persona for
     * @returns User persona object
     */
    RenAIService.prototype.generateUserPersona = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, categories, bookingCount, userType, recentBookings, engagementLevel, firstBooking, tenureDays, favoriteCategories, calendarEvents, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            price: true,
                                            category: true
                                        }
                                    }
                                },
                                orderBy: { startDate: 'asc' }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        categories = userBookings.map(function (booking) { return booking.listing.category; });
                        bookingCount = userBookings.length;
                        userType = 'casual';
                        if (bookingCount >= 10) {
                            userType = 'power_user';
                        }
                        else if (bookingCount >= 3) {
                            userType = 'active';
                        }
                        recentBookings = userBookings.filter(function (booking) {
                            return booking.startDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        } // Last 30 days
                        );
                        engagementLevel = recentBookings.length > 0 ? 'high' : 'low';
                        firstBooking = userBookings[0];
                        tenureDays = firstBooking ? Math.floor((Date.now() - firstBooking.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                        favoriteCategories = Array.from(new Set(categories));
                        return [4 /*yield*/, this.getUserCalendarEvents(userId)];
                    case 2:
                        calendarEvents = _a.sent();
                        return [2 /*return*/, {
                                userType: userType,
                                engagementLevel: engagementLevel,
                                tenureDays: tenureDays,
                                favoriteCategories: favoriteCategories,
                                calendarEvents: calendarEvents
                            }];
                    case 3:
                        error_27 = _a.sent();
                        console.error('Error generating user persona:', error_27);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate detailed user persona based on rental history and behavior patterns
     * @param userId The user ID to generate persona for
     * @returns Detailed user persona object
     */
    RenAIService.prototype.generateDetailedUserPersona = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, userListings, userWishlist, userReviews, categoriesRented, favoriteCategories, categoriesListed, listedCategories, rentedPrices, listedPrices, allPrices, priceRange, userType, totalInteractions, engagementLevel, joinDate, tenureDays, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            price: true,
                                            category: true
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: { ownerId: userId },
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    price: true,
                                    category: true,
                                    createdAt: true
                                }
                            })];
                    case 2:
                        userListings = _a.sent();
                        return [4 /*yield*/, prisma.wishlist.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            description: true,
                                            price: true,
                                            category: true
                                        }
                                    }
                                }
                            })];
                    case 3:
                        userWishlist = _a.sent();
                        return [4 /*yield*/, prisma.review.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                }
                            })];
                    case 4:
                        userReviews = _a.sent();
                        categoriesRented = userBookings.map(function (booking) { return booking.listing.category || booking.listing.description; });
                        favoriteCategories = __spreadArray([], new Set(categoriesRented), true).filter(Boolean);
                        categoriesListed = userListings.map(function (listing) { return listing.category || listing.description; });
                        listedCategories = __spreadArray([], new Set(categoriesListed), true).filter(Boolean);
                        rentedPrices = userBookings.map(function (booking) { return booking.listing.price; });
                        listedPrices = userListings.map(function (listing) { return listing.price; });
                        allPrices = __spreadArray(__spreadArray([], rentedPrices, true), listedPrices, true).filter(Boolean);
                        priceRange = allPrices.length > 0 ? {
                            min: Math.min.apply(Math, allPrices),
                            max: Math.max.apply(Math, allPrices)
                        } : { min: 0, max: 0 };
                        userType = 'casual';
                        if (userBookings.length > 10 && userListings.length > 5) {
                            userType = 'power_user';
                        }
                        else if (userBookings.length > 5 || userListings.length > 3) {
                            userType = 'active';
                        }
                        totalInteractions = userBookings.length + userListings.length + userWishlist.length + userReviews.length;
                        engagementLevel = totalInteractions > 20 ? 'high' : totalInteractions > 10 ? 'medium' : 'low';
                        joinDate = userListings.length > 0
                            ? new Date(Math.min.apply(Math, userListings.map(function (l) { return l.createdAt.getTime(); })))
                            : userBookings.length > 0
                                ? userBookings[0].createdAt
                                : new Date();
                        tenureDays = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
                        return [2 /*return*/, {
                                userId: userId,
                                userType: userType,
                                engagementLevel: engagementLevel,
                                joinDate: joinDate,
                                tenureDays: tenureDays,
                                favoriteCategories: favoriteCategories,
                                listedCategories: listedCategories,
                                priceRange: priceRange,
                                totalBookings: userBookings.length,
                                totalListings: userListings.length,
                                totalWishlistItems: userWishlist.length,
                                totalReviews: userReviews.length,
                                preferredCategories: __spreadArray([], new Set(__spreadArray(__spreadArray([], favoriteCategories, true), listedCategories, true)), true),
                                lastActivity: userBookings.length > 0
                                    ? userBookings[userBookings.length - 1].createdAt
                                    : userListings.length > 0
                                        ? userListings[userListings.length - 1].createdAt
                                        : new Date()
                            }];
                    case 5:
                        error_28 = _a.sent();
                        console.error('Error generating detailed user persona:', error_28);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get preferred time slots based on booking hours
     * @param hours Array of booking hours (0-23)
     * @returns Record of time slots with frequency counts
     */
    RenAIService.prototype.getPreferredTimeSlots = function (hours) {
        var slots = {
            morning: 0, // 6-11 AM
            afternoon: 0, // 12-5 PM
            evening: 0, // 6-11 PM
            night: 0 // 12-5 AM
        };
        hours.forEach(function (hour) {
            if (hour >= 6 && hour <= 11) {
                slots.morning++;
            }
            else if (hour >= 12 && hour <= 17) {
                slots.afternoon++;
            }
            else if (hour >= 18 && hour <= 23) {
                slots.evening++;
            }
            else {
                slots.night++;
            }
        });
        return slots;
    };
    /**
     * Get preferred days based on booking days
     * @param days Array of booking days (0-6, Sunday-Saturday)
     * @returns Record of days with frequency counts
     */
    RenAIService.prototype.getPreferredDays = function (days) {
        var dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var preferredDays = {};
        days.forEach(function (day) {
            var dayName = dayNames[day];
            preferredDays[dayName] = (preferredDays[dayName] || 0) + 1;
        });
        return preferredDays;
    };
    /**
     * Get seasonal preferences based on booking months
     * @param months Array of booking months (0-11)
     * @returns Record of seasons with frequency counts
     */
    RenAIService.prototype.getSeasonalPreferences = function (months) {
        var seasons = {
            spring: 0, // March-May
            summer: 0, // June-August
            autumn: 0, // September-November
            winter: 0 // December-February
        };
        months.forEach(function (month) {
            if (month >= 2 && month <= 4) {
                seasons.spring++;
            }
            else if (month >= 5 && month <= 7) {
                seasons.summer++;
            }
            else if (month >= 8 && month <= 10) {
                seasons.autumn++;
            }
            else {
                seasons.winter++;
            }
        });
        return seasons;
    };
    /**
     * Identify behavioral patterns from user data
     * @param user User data with all activities
     * @returns Object with identified behavioral patterns
     */
    RenAIService.prototype.identifyBehavioralPatterns = function (user) {
        var patterns = {};
        // Quick decision maker (books within 24 hours of viewing)
        var quickBookings = user.bookings.filter(function (booking) {
            var timeDiff = booking.createdAt.getTime() - booking.listing.createdAt.getTime();
            return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours
        });
        if (quickBookings.length > user.bookings.length * 0.3) {
            patterns.decisionMaking = 'quick_decision_maker';
        }
        else if (quickBookings.length > user.bookings.length * 0.1) {
            patterns.decisionMaking = 'moderate_decision_maker';
        }
        else {
            patterns.decisionMaking = 'deliberate_decision_maker';
        }
        // Review behavior
        if (user.reviews.length === 0) {
            patterns.reviewBehavior = 'non_reviewer';
        }
        else if (user.reviews.length > user.bookings.length * 0.7) {
            patterns.reviewBehavior = 'active_reviewer';
        }
        else {
            patterns.reviewBehavior = 'selective_reviewer';
        }
        // Wishlist behavior
        if (user.wishlist.length === 0) {
            patterns.wishlistBehavior = 'non_wishlist_user';
        }
        else if (user.wishlist.length > 10) {
            patterns.wishlistBehavior = 'heavy_wishlist_user';
        }
        else {
            patterns.wishlistBehavior = 'moderate_wishlist_user';
        }
        // Listing behavior
        if (user.listings.length === 0) {
            patterns.listingBehavior = 'renter_only';
        }
        else if (user.listings.length > user.bookings.length) {
            patterns.listingBehavior = 'owner_focused';
        }
        else if (user.listings.length === user.bookings.length) {
            patterns.listingBehavior = 'balanced_renter_owner';
        }
        else {
            patterns.listingBehavior = 'renter_focused';
        }
        return patterns;
    };
    /**
     * Get personalized recommendations for a user based on their persona
     * @param userId The user ID to get recommendations for
     * @returns Array of recommended listings
     */
    RenAIService.prototype.getPersonalizedRecommendations = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var persona, userBookings, categories, recommendations, enrichedListings, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.generateUserPersona(userId)];
                    case 1:
                        persona = _a.sent();
                        if (!!persona) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTrendingListings()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, prisma.booking.findMany({
                            where: { userId: userId },
                            include: { listing: true }
                        })];
                    case 4:
                        userBookings = _a.sent();
                        if (!(userBookings.length === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getTrendingListings()];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        categories = userBookings.map(function (booking) { return booking.listing.description; });
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    AND: [
                                        {
                                            description: {
                                                in: categories
                                            }
                                        },
                                        {
                                            price: {
                                                gte: persona.priceRange.min * 0.7,
                                                lte: persona.priceRange.max * 1.3
                                            }
                                        }
                                    ]
                                },
                                take: 10,
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                include: {
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    reviews: {
                                        select: {
                                            rating: true
                                        }
                                    }
                                }
                            })];
                    case 7:
                        recommendations = _a.sent();
                        enrichedListings = recommendations.map(function (listing) {
                            var totalRating = listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
                            return {
                                id: listing.id,
                                title: listing.title,
                                description: listing.description,
                                price: listing.price,
                                location: listing.location,
                                images: JSON.parse(listing.images || '[]'),
                                ownerId: listing.ownerId,
                                ownerName: listing.owner.name,
                                averageRating: averageRating,
                                reviewCount: listing.reviews.length,
                                createdAt: listing.createdAt
                            };
                        }).filter(function (listing) { return listing.averageRating >= 3.5; });
                        return [2 /*return*/, enrichedListings.slice(0, 5)];
                    case 8:
                        error_29 = _a.sent();
                        console.error('Error getting personalized recommendations:', error_29);
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get collaborative filtering recommendations ("Users who rented this also rented...")
     * @param userId The user ID to get recommendations for
     * @returns Array of recommended listings based on similar users
     */
    RenAIService.prototype.getCollaborativeRecommendations = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, userListingIds, userCategories, similarUsers, similarUserIds, similarUserBookings, recommendationScores, _loop_2, _i, similarUserBookings_1, booking, scoredRecommendations, enrichedRecommendations, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            category: true,
                                            description: true,
                                            price: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        if (userBookings.length === 0) {
                            return [2 /*return*/, []];
                        }
                        userListingIds = userBookings.map(function (booking) { return booking.listingId; });
                        userCategories = __spreadArray([], new Set(userBookings.map(function (booking) { return booking.listing.category; })), true).filter(Boolean);
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        SELECT \n          b.userId,\n          COUNT(b.listingId) as sharedItems,\n          COUNT(b.listingId) * 1.0 / (\n            SELECT COUNT(*) \n            FROM Booking \n            WHERE userId = b.userId\n          ) as similarityScore\n        FROM Booking b\n        WHERE b.listingId IN (", ")\n          AND b.userId != ", "\n        GROUP BY b.userId\n        HAVING COUNT(b.listingId) >= 1\n        ORDER BY similarityScore DESC\n        LIMIT 20\n      "], ["\n        SELECT \n          b.userId,\n          COUNT(b.listingId) as sharedItems,\n          COUNT(b.listingId) * 1.0 / (\n            SELECT COUNT(*) \n            FROM Booking \n            WHERE userId = b.userId\n          ) as similarityScore\n        FROM Booking b\n        WHERE b.listingId IN (", ")\n          AND b.userId != ", "\n        GROUP BY b.userId\n        HAVING COUNT(b.listingId) >= 1\n        ORDER BY similarityScore DESC\n        LIMIT 20\n      "])), client_1.Prisma.join(userListingIds), userId)];
                    case 2:
                        similarUsers = _a.sent();
                        if (similarUsers.length === 0) {
                            return [2 /*return*/, []];
                        }
                        similarUserIds = similarUsers.map(function (user) { return user.userId; });
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: {
                                        in: similarUserIds
                                    },
                                    listingId: {
                                        notIn: userListingIds
                                    }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            category: true,
                                            description: true,
                                            price: true,
                                            reviews: {
                                                select: {
                                                    rating: true
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                    case 3:
                        similarUserBookings = _a.sent();
                        if (similarUserBookings.length === 0) {
                            return [2 /*return*/, []];
                        }
                        recommendationScores = {};
                        _loop_2 = function (booking) {
                            var listingId = booking.listingId;
                            if (!recommendationScores[listingId]) {
                                recommendationScores[listingId] = {
                                    listing: booking.listing,
                                    score: 0,
                                    sources: []
                                };
                            }
                            // Find how many similar users rented this item
                            var rentingUsers = similarUserBookings.filter(function (b) { return b.listingId === listingId; }).length;
                            // Base score from user similarity
                            var baseScore = rentingUsers * 10;
                            // Category match bonus
                            var categoryBonus = 0;
                            if (userCategories.includes(booking.listing.category)) {
                                categoryBonus = 20;
                                recommendationScores[listingId].sources.push("category_match");
                            }
                            // Popularity bonus
                            var popularityBonus = Math.min(rentingUsers * 2, 15);
                            // Rating bonus
                            var avgRating = booking.listing.reviews.length > 0
                                ? booking.listing.reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / booking.listing.reviews.length
                                : 0;
                            var ratingBonus = avgRating * 3;
                            // Calculate final score
                            var finalScore = baseScore + categoryBonus + popularityBonus + ratingBonus;
                            if (finalScore > recommendationScores[listingId].score) {
                                recommendationScores[listingId].score = finalScore;
                                if (!recommendationScores[listingId].sources.includes("user_similarity")) {
                                    recommendationScores[listingId].sources.push("user_similarity");
                                }
                            }
                        };
                        for (_i = 0, similarUserBookings_1 = similarUserBookings; _i < similarUserBookings_1.length; _i++) {
                            booking = similarUserBookings_1[_i];
                            _loop_2(booking);
                        }
                        scoredRecommendations = Object.values(recommendationScores)
                            .sort(function (a, b) { return b.score - a.score; })
                            .slice(0, 10);
                        enrichedRecommendations = scoredRecommendations.map(function (rec) {
                            var totalRating = rec.listing.reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
                            var averageRating = rec.listing.reviews.length > 0 ? totalRating / rec.listing.reviews.length : 0;
                            return {
                                id: rec.listing.id,
                                title: rec.listing.title,
                                description: rec.listing.description,
                                price: rec.listing.price,
                                category: rec.listing.category,
                                averageRating: averageRating,
                                reviewCount: rec.listing.reviews.length,
                                recommendationScore: rec.score,
                                recommendationSources: rec.sources
                            };
                        });
                        return [2 /*return*/, enrichedRecommendations];
                    case 4:
                        error_30 = _a.sent();
                        console.error('Error getting collaborative recommendations:', error_30);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get maintenance recommendations for listed items
     * @param userId The user ID to get maintenance recommendations for
     * @returns Array of maintenance recommendations
     */
    RenAIService.prototype.getMaintenanceRecommendations = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendations, userListings, _i, userListings_1, listing, lastBooking, daysSinceLastBooking, recentBookings, totalBookingDays, daysSinceReturn, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recommendations = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: { ownerId: userId },
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    createdAt: true,
                                    bookings: {
                                        select: {
                                            id: true,
                                            startDate: true,
                                            endDate: true,
                                            status: true
                                        },
                                        orderBy: {
                                            startDate: 'desc'
                                        }
                                    }
                                }
                            })];
                    case 2:
                        userListings = _a.sent();
                        // For each listing, check if maintenance is needed
                        for (_i = 0, userListings_1 = userListings; _i < userListings_1.length; _i++) {
                            listing = userListings_1[_i];
                            lastBooking = listing.bookings.length > 0 ? listing.bookings[0] : null;
                            daysSinceLastBooking = lastBooking
                                ? Math.floor((Date.now() - lastBooking.endDate.getTime()) / (1000 * 60 * 60 * 24))
                                : Math.floor((Date.now() - listing.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                            recentBookings = listing.bookings.filter(function (booking) {
                                return booking.startDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
                                    booking.status === 'completed';
                            });
                            totalBookingDays = recentBookings.reduce(function (total, booking) {
                                var days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
                                return total + days;
                            }, 0);
                            // Recommend maintenance based on usage
                            if (totalBookingDays > 10) {
                                // High usage - recommend maintenance
                                recommendations.push({
                                    type: "maintenance_recommendation",
                                    message: "Your \"".concat(listing.title, "\" has been heavily used recently (").concat(totalBookingDays, " days in the last 30 days). Consider performing maintenance to keep it in good condition."),
                                    listingId: listing.id,
                                    priority: 9
                                });
                            }
                            else if (daysSinceLastBooking > 30) {
                                // Not used for a while - recommend check-up
                                recommendations.push({
                                    type: "maintenance_recommendation",
                                    message: "It's been ".concat(daysSinceLastBooking, " days since your \"").concat(listing.title, "\" was last rented. Consider checking its condition to ensure it's ready for the next renter."),
                                    listingId: listing.id,
                                    priority: 7
                                });
                            }
                            else if (listing.bookings.length > 0 && lastBooking.status === 'completed') {
                                daysSinceReturn = Math.floor((Date.now() - lastBooking.endDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (daysSinceReturn <= 3) {
                                    recommendations.push({
                                        type: "maintenance_recommendation",
                                        message: "Your \"".concat(listing.title, "\" was recently returned. Now is a good time to perform post-use maintenance if needed."),
                                        listingId: listing.id,
                                        priority: 8
                                    });
                                }
                            }
                        }
                        // Sort recommendations by priority
                        return [2 /*return*/, recommendations.sort(function (a, b) { return b.priority - a.priority; })];
                    case 3:
                        error_31 = _a.sent();
                        console.error('Error getting maintenance recommendations:', error_31);
                        return [2 /*return*/, recommendations];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get seasonal listing suggestions for owners
     * @param userId The user ID to get seasonal suggestions for
     * @returns Array of seasonal listing suggestions
     */
    RenAIService.prototype.getSeasonalListingSuggestions = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions, currentMonth, seasonalSuggestions, userBookings, userListings, userCategories, uniqueCategories, monthSuggestions, bestSeasonalSuggestion, highestMatchScore, _i, monthSuggestions_2, suggestion, matchScore, _loop_3, _a, _b, category, userCategory, categorySuggestions, categoryMonthSuggestions, error_32;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        suggestions = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        currentMonth = new Date().getMonth();
                        seasonalSuggestions = {
                            0: [
                                { item: "New Year's party supplies (decorations, party hats, noisemakers)", categories: ["party", "celebration", "event"] },
                                { item: "Winter clothing (sweaters, jackets, scarves)", categories: ["clothing", "fashion", "winter"] },
                                { item: "New Year resolution items (fitness equipment, books, planners)", categories: ["sports", "fitness", "education"] }
                            ],
                            1: [
                                { item: "Valentine's Day gifts (chocolates, flowers, greeting cards)", categories: ["gift", "romance", "celebration"] },
                                { item: "Romantic dinner items (candles, tablecloths, dinnerware)", categories: ["kitchen", "dining", "romance"] },
                                { item: "Date night accessories (board games, movie equipment)", categories: ["game", "entertainment", "romance"] }
                            ],
                            2: [
                                { item: "Gardening tools (shovels, rakes, watering cans)", categories: ["garden", "outdoor", "tool"] },
                                { item: "Spring cleaning supplies (vacuums, mops, cleaning products)", categories: ["cleaning", "home", "utility"] },
                                { item: "Easter party items (decorations, baskets, eggs)", categories: ["party", "celebration", "event"] }
                            ],
                            3: [
                                { item: "Summer sports equipment (beach balls, frisbees, volleyball nets)", categories: ["sports", "outdoor", "recreation"] },
                                { item: "Grilling and BBQ equipment (grills, utensils, coolers)", categories: ["kitchen", "outdoor", "cooking"] },
                                { item: "Outdoor furniture (patio chairs, tables, umbrellas)", categories: ["furniture", "outdoor", "home"] }
                            ],
                            4: [
                                { item: "Swimming gear (floaties, goggles, swimwear)", categories: ["swimming", "beach", "outdoor"] },
                                { item: "Summer party supplies (decorations, serving equipment)", categories: ["party", "celebration", "event"] },
                                { item: "Outdoor cooking equipment (portable stoves, griddles)", categories: ["kitchen", "outdoor", "cooking"] }
                            ],
                            5: [
                                { item: "Independence Day decorations (flags, banners, fireworks)", categories: ["decoration", "celebration", "event"] },
                                { item: "Summer vacation rentals (camping gear, travel accessories)", categories: ["travel", "outdoor", "recreation"] },
                                { item: "School supplies (backpacks, notebooks, pens)", categories: ["education", "office", "study"] }
                            ],
                            6: [
                                { item: "School supplies (calculators, laptops, tablets)", categories: ["education", "office", "study"] },
                                { item: "Study aids (whiteboards, desk organizers, lamps)", categories: ["education", "study", "technology"] },
                                { item: "Back-to-school clothing (uniforms, shoes, bags)", categories: ["clothing", "fashion", "school"] }
                            ],
                            7: [
                                { item: "Rain gear (umbrellas, raincoats, waterproof bags)", categories: ["weather", "outdoor", "utility"] },
                                { item: "Indoor entertainment (board games, puzzles, books)", categories: ["game", "entertainment", "home"] },
                                { item: "Home improvement tools (leak repair kits, waterproofing supplies)", categories: ["home", "tool", "utility"] }
                            ],
                            8: [
                                { item: "Harvest celebration items (decorations, serving dishes)", categories: ["celebration", "event", "decoration"] },
                                { item: "Fall gardening tools (leaf rakes, compost bins)", categories: ["garden", "outdoor", "tool"] },
                                { item: "Preservation equipment (dehydrators, canning supplies)", categories: ["kitchen", "food", "utility"] }
                            ],
                            9: [
                                { item: "Halloween costumes and accessories", categories: ["costume", "celebration", "fashion"] },
                                { item: "Halloween decorations (pumpkins, lights, props)", categories: ["decoration", "celebration", "event"] },
                                { item: "Horror movie equipment (projectors, sound systems)", categories: ["entertainment", "media", "technology"] }
                            ],
                            10: [
                                { item: "Thanksgiving dinner supplies (roasting pans, serving dishes)", categories: ["kitchen", "dining", "cooking"] },
                                { item: "Family gathering items (tables, chairs, tablecloths)", categories: ["party", "celebration", "event"] },
                                { item: "All Saints' Day decorations (flowers, candles)", categories: ["decoration", "celebration", "event"] }
                            ],
                            11: [
                                { item: "Christmas decorations (trees, lights, ornaments)", categories: ["decoration", "celebration", "event"] },
                                { item: "Holiday party supplies (decorations, serving equipment)", categories: ["party", "celebration", "event"] },
                                { item: "Gift wrapping materials (paper, ribbons, boxes)", categories: ["gift", "party", "utility"] }
                            ]
                        };
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            category: true,
                                            description: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        userBookings = _c.sent();
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: { ownerId: userId },
                                select: {
                                    category: true,
                                    description: true
                                }
                            })];
                    case 3:
                        userListings = _c.sent();
                        userCategories = __spreadArray(__spreadArray([], userBookings.map(function (booking) { return booking.listing.category || booking.listing.description; }), true), userListings.map(function (listing) { return listing.category || listing.description; }), true);
                        uniqueCategories = __spreadArray([], new Set(userCategories), true).filter(Boolean).map(function (cat) { return cat.toLowerCase(); });
                        monthSuggestions = seasonalSuggestions[currentMonth] || [];
                        bestSeasonalSuggestion = null;
                        highestMatchScore = 0;
                        // If user has categories, find the best match
                        if (uniqueCategories.length > 0) {
                            for (_i = 0, monthSuggestions_2 = monthSuggestions; _i < monthSuggestions_2.length; _i++) {
                                suggestion = monthSuggestions_2[_i];
                                matchScore = 0;
                                _loop_3 = function (category) {
                                    if (uniqueCategories.some(function (userCat) {
                                        return userCat.includes(category) ||
                                            category.includes(userCat);
                                    })) {
                                        matchScore++;
                                    }
                                };
                                // Calculate match score based on category overlap
                                for (_a = 0, _b = suggestion.categories; _a < _b.length; _a++) {
                                    category = _b[_a];
                                    _loop_3(category);
                                }
                                if (matchScore > highestMatchScore) {
                                    highestMatchScore = matchScore;
                                    bestSeasonalSuggestion = suggestion.item;
                                }
                            }
                        }
                        // If no personalized match found, use the first suggestion
                        if (!bestSeasonalSuggestion && monthSuggestions.length > 0) {
                            bestSeasonalSuggestion = monthSuggestions[0].item;
                        }
                        // Add personalized seasonal suggestion if available
                        if (bestSeasonalSuggestion) {
                            suggestions.push({
                                type: "seasonal_listing_suggestion",
                                message: "Seasonal opportunity: Consider listing ".concat(bestSeasonalSuggestion, " for the upcoming season."),
                                priority: 9
                            });
                        }
                        // Add category-specific seasonal suggestions
                        if (uniqueCategories.length > 0) {
                            userCategory = uniqueCategories[0];
                            categorySuggestions = {
                                0: ["".concat(userCategory, " for New Year celebrations")],
                                1: ["".concat(userCategory, " for Valentine's Day gifts")],
                                2: ["".concat(userCategory, " for spring activities")],
                                3: ["".concat(userCategory, " for summer use")],
                                4: ["".concat(userCategory, " for beach/pool activities")],
                                5: ["".concat(userCategory, " for summer vacations")],
                                6: ["".concat(userCategory, " for back-to-school")],
                                7: ["".concat(userCategory, " for indoor use during rains")],
                                8: ["".concat(userCategory, " for harvest season")],
                                9: ["".concat(userCategory, " for Halloween")],
                                10: ["".concat(userCategory, " for family gatherings")],
                                11: ["".concat(userCategory, " for Christmas gifts")]
                            };
                            categoryMonthSuggestions = categorySuggestions[currentMonth] || [];
                            categoryMonthSuggestions.forEach(function (suggestion) {
                                suggestions.push({
                                    type: "seasonal_listing_suggestion",
                                    message: "Based on your rental history: Consider listing ".concat(suggestion, "."),
                                    priority: 8
                                });
                            });
                        }
                        // Sort suggestions by priority
                        return [2 /*return*/, suggestions.sort(function (a, b) { return b.priority - a.priority; })];
                    case 4:
                        error_32 = _c.sent();
                        console.error('Error getting seasonal listing suggestions:', error_32);
                        return [2 /*return*/, suggestions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate detailed analytics dashboard for user interactions
     * @param userId The user ID to generate analytics for (optional, if null generates for all users)
     * @returns Analytics dashboard data
     */
    RenAIService.prototype.generateAnalyticsDashboard = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userActivity, _a, platformMetrics, aiAnalytics, engagementMetrics, conversionData, sentimentData, error_33;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3:
                        userActivity = _a;
                        return [4 /*yield*/, this.getPlatformMetrics()];
                    case 4:
                        platformMetrics = _b.sent();
                        return [4 /*yield*/, this.getAIInteractionAnalytics()];
                    case 5:
                        aiAnalytics = _b.sent();
                        return [4 /*yield*/, this.getUserEngagementMetrics(userId)];
                    case 6:
                        engagementMetrics = _b.sent();
                        return [4 /*yield*/, this.getConversionFunnelData(userId)];
                    case 7:
                        conversionData = _b.sent();
                        return [4 /*yield*/, this.getSentimentAnalysis(userId)];
                    case 8:
                        sentimentData = _b.sent();
                        return [2 /*return*/, {
                                generatedAt: new Date(),
                                userId: userId || 'all',
                                platformMetrics: platformMetrics,
                                aiAnalytics: aiAnalytics,
                                engagementMetrics: engagementMetrics,
                                conversionData: conversionData,
                                sentimentData: sentimentData,
                                userActivity: userActivity
                            }];
                    case 9:
                        error_33 = _b.sent();
                        console.error('Error generating analytics dashboard:', error_33);
                        throw error_33;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get overall platform metrics
     * @returns Platform metrics data
     */
    RenAIService.prototype.getPlatformMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalUsers, totalListings, totalBookings, totalReviews, reviews, averageRating, thirtyDaysAgo, newUsers, newListings, newBookings, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, prisma.user.count()];
                    case 1:
                        totalUsers = _a.sent();
                        return [4 /*yield*/, prisma.listing.count()];
                    case 2:
                        totalListings = _a.sent();
                        return [4 /*yield*/, prisma.booking.count()];
                    case 3:
                        totalBookings = _a.sent();
                        return [4 /*yield*/, prisma.review.count()];
                    case 4:
                        totalReviews = _a.sent();
                        return [4 /*yield*/, prisma.review.findMany({
                                select: { rating: true }
                            })];
                    case 5:
                        reviews = _a.sent();
                        averageRating = reviews.length > 0
                            ? reviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / reviews.length
                            : 0;
                        thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, prisma.user.count({
                                where: { createdAt: { gte: thirtyDaysAgo } }
                            })];
                    case 6:
                        newUsers = _a.sent();
                        return [4 /*yield*/, prisma.listing.count({
                                where: { createdAt: { gte: thirtyDaysAgo } }
                            })];
                    case 7:
                        newListings = _a.sent();
                        return [4 /*yield*/, prisma.booking.count({
                                where: { createdAt: { gte: thirtyDaysAgo } }
                            })];
                    case 8:
                        newBookings = _a.sent();
                        return [2 /*return*/, {
                                totalUsers: totalUsers,
                                totalListings: totalListings,
                                totalBookings: totalBookings,
                                totalReviews: totalReviews,
                                averageRating: averageRating.toFixed(2),
                                recentActivity: {
                                    newUsers: newUsers,
                                    newListings: newListings,
                                    newBookings: newBookings,
                                    period: "Last 30 days"
                                }
                            }];
                    case 9:
                        error_34 = _a.sent();
                        console.error('Error getting platform metrics:', error_34);
                        return [2 /*return*/, {
                                totalUsers: 0,
                                totalListings: 0,
                                totalBookings: 0,
                                totalReviews: 0,
                                averageRating: "0.00",
                                recentActivity: {
                                    newUsers: 0,
                                    newListings: 0,
                                    newBookings: 0,
                                    period: "Last 30 days"
                                }
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get AI interaction analytics
     * @returns AI interaction analytics data
     */
    RenAIService.prototype.getAIInteractionAnalytics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalInteractions, thirtyDaysAgo, recentInteractions, interactionsByDate_1, actionTypes_1, feedbackData, feedbackStats, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, prisma.aIInteraction.count()];
                    case 1:
                        totalInteractions = _a.sent();
                        thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: { createdAt: { gte: thirtyDaysAgo } },
                                select: { createdAt: true, actionTaken: true }
                            })];
                    case 2:
                        recentInteractions = _a.sent();
                        interactionsByDate_1 = {};
                        recentInteractions.forEach(function (interaction) {
                            var date = interaction.createdAt.toISOString().split('T')[0];
                            interactionsByDate_1[date] = (interactionsByDate_1[date] || 0) + 1;
                        });
                        actionTypes_1 = {};
                        recentInteractions.forEach(function (interaction) {
                            if (interaction.actionTaken) {
                                var actionType = interaction.actionTaken.split(':')[0];
                                actionTypes_1[actionType] = (actionTypes_1[actionType] || 0) + 1;
                            }
                        });
                        return [4 /*yield*/, prisma.aIFeedback.findMany({
                                select: { rating: true }
                            })];
                    case 3:
                        feedbackData = _a.sent();
                        feedbackStats = {
                            total: feedbackData.length,
                            averageRating: feedbackData.length > 0
                                ? (feedbackData.reduce(function (sum, feedback) { return sum + feedback.rating; }, 0) / feedbackData.length).toFixed(2)
                                : "0.00",
                            ratings: {
                                1: feedbackData.filter(function (f) { return f.rating === 1; }).length,
                                2: feedbackData.filter(function (f) { return f.rating === 2; }).length,
                                3: feedbackData.filter(function (f) { return f.rating === 3; }).length,
                                4: feedbackData.filter(function (f) { return f.rating === 4; }).length,
                                5: feedbackData.filter(function (f) { return f.rating === 5; }).length
                            }
                        };
                        return [2 /*return*/, {
                                totalInteractions: totalInteractions,
                                interactionsByDate: interactionsByDate_1,
                                actionTypes: actionTypes_1,
                                feedbackStats: feedbackStats
                            }];
                    case 4:
                        error_35 = _a.sent();
                        console.error('Error getting AI interaction analytics:', error_35);
                        return [2 /*return*/, {
                                totalInteractions: 0,
                                interactionsByDate: {},
                                actionTypes: {},
                                feedbackStats: {
                                    total: 0,
                                    averageRating: "0.00",
                                    ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                                }
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Prioritize improvements based on impact and frequency
     * @param suggestions Array of improvement suggestions
     * @returns Prioritized improvements
     */
    RenAIService.prototype.prioritizeImprovements = function (suggestions) {
        try {
            // Sort by priority (highest first)
            return suggestions.sort(function (a, b) { return b.priority - a.priority; });
        }
        catch (error) {
            console.error('Error prioritizing improvements:', error);
            return suggestions;
        }
    };
    /**
     * Integrate with user behavior analytics
     * @param userId Optional user ID for personalized analytics
     * @returns User behavior analytics data
     */
    RenAIService.prototype.integrateUserBehaviorAnalytics = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userActivity, _a, platformAnalytics, journeyAnalytics, engagementAnalytics, conversionAnalytics, behaviorAnalytics, error_36;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3:
                        userActivity = _a;
                        return [4 /*yield*/, this.getPlatformBehaviorAnalytics()];
                    case 4:
                        platformAnalytics = _b.sent();
                        return [4 /*yield*/, this.getUserJourneyAnalytics(userId)];
                    case 5:
                        journeyAnalytics = _b.sent();
                        return [4 /*yield*/, this.getEngagementAnalytics(userId)];
                    case 6:
                        engagementAnalytics = _b.sent();
                        return [4 /*yield*/, this.getConversionAnalytics(userId)];
                    case 7:
                        conversionAnalytics = _b.sent();
                        behaviorAnalytics = {
                            userActivity: userActivity,
                            platformAnalytics: platformAnalytics,
                            journeyAnalytics: journeyAnalytics,
                            engagementAnalytics: engagementAnalytics,
                            conversionAnalytics: conversionAnalytics,
                            analyzedAt: new Date()
                        };
                        // Store analytics data for future reference
                        return [4 /*yield*/, prisma.userBehaviorAnalytics.create({
                                data: {
                                    userId: userId,
                                    analyticsData: JSON.stringify(behaviorAnalytics),
                                    timestamp: new Date()
                                }
                            })];
                    case 8:
                        // Store analytics data for future reference
                        _b.sent();
                        return [2 /*return*/, behaviorAnalytics];
                    case 9:
                        error_36 = _b.sent();
                        console.error('Error integrating user behavior analytics:', error_36);
                        throw error_36;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get platform-wide behavior analytics
     * @returns Platform behavior analytics data
     */
    RenAIService.prototype.getPlatformBehaviorAnalytics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalUsers, activeUsers, totalListings, activeListings, totalBookings, recentBookings, totalReviews, recentReviews, reviews, averageRating, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, prisma.user.count()];
                    case 1:
                        totalUsers = _a.sent();
                        return [4 /*yield*/, prisma.user.count({
                                where: {
                                    bookings: {
                                        some: {
                                            createdAt: {
                                                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                            }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        activeUsers = _a.sent();
                        return [4 /*yield*/, prisma.listing.count()];
                    case 3:
                        totalListings = _a.sent();
                        return [4 /*yield*/, prisma.listing.count({
                                where: {
                                    bookings: {
                                        some: {
                                            createdAt: {
                                                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
                                            }
                                        }
                                    }
                                }
                            })];
                    case 4:
                        activeListings = _a.sent();
                        return [4 /*yield*/, prisma.booking.count()];
                    case 5:
                        totalBookings = _a.sent();
                        return [4 /*yield*/, prisma.booking.count({
                                where: {
                                    createdAt: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                }
                            })];
                    case 6:
                        recentBookings = _a.sent();
                        return [4 /*yield*/, prisma.review.count()];
                    case 7:
                        totalReviews = _a.sent();
                        return [4 /*yield*/, prisma.review.count({
                                where: {
                                    createdAt: {
                                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                                    }
                                }
                            })];
                    case 8:
                        recentReviews = _a.sent();
                        return [4 /*yield*/, prisma.review.findMany({
                                select: { rating: true }
                            })];
                    case 9:
                        reviews = _a.sent();
                        averageRating = reviews.length > 0
                            ? reviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / reviews.length
                            : 0;
                        return [2 /*return*/, {
                                userStatistics: {
                                    totalUsers: totalUsers,
                                    activeUsers: activeUsers,
                                    activeUserPercentage: totalUsers > 0 ? parseFloat(((activeUsers / totalUsers) * 100).toFixed(2)) : 0
                                },
                                listingStatistics: {
                                    totalListings: totalListings,
                                    activeListings: activeListings,
                                    activeListingPercentage: totalListings > 0 ? parseFloat(((activeListings / totalListings) * 100).toFixed(2)) : 0
                                },
                                bookingStatistics: {
                                    totalBookings: totalBookings,
                                    recentBookings: recentBookings,
                                    recentBookingPercentage: totalBookings > 0 ? parseFloat(((recentBookings / totalBookings) * 100).toFixed(2)) : 0
                                },
                                reviewStatistics: {
                                    totalReviews: totalReviews,
                                    recentReviews: recentReviews,
                                    averageRating: parseFloat(averageRating.toFixed(2))
                                }
                            }];
                    case 10:
                        error_37 = _a.sent();
                        console.error('Error getting platform behavior analytics:', error_37);
                        return [2 /*return*/, {
                                userStatistics: { totalUsers: 0, activeUsers: 0, activeUserPercentage: 0 },
                                listingStatistics: { totalListings: 0, activeListings: 0, activeListingPercentage: 0 },
                                bookingStatistics: { totalBookings: 0, recentBookings: 0, recentBookingPercentage: 0 },
                                reviewStatistics: { totalReviews: 0, recentReviews: 0, averageRating: 0 }
                            }];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user journey analytics
     * @param userId Optional user ID
     * @returns User journey analytics data
     */
    RenAIService.prototype.getUserJourneyAnalytics = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, interactions, bookings, listings, _a, reviews, firstInteraction, firstBooking, firstListing, firstReview, timeToFirstBooking, timeToFirstListing, userType, error_38;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        whereClause = userId ? { userId: userId } : {};
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: whereClause,
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 1:
                        interactions = _b.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: whereClause,
                                include: { listing: true },
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 2:
                        bookings = _b.sent();
                        if (!userId) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: { ownerId: userId },
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = [];
                        _b.label = 5;
                    case 5:
                        listings = _a;
                        return [4 /*yield*/, prisma.review.findMany({
                                where: whereClause,
                                include: { listing: true },
                                orderBy: { createdAt: 'asc' }
                            })];
                    case 6:
                        reviews = _b.sent();
                        firstInteraction = interactions.length > 0 ? interactions[0].createdAt : null;
                        firstBooking = bookings.length > 0 ? bookings[0].createdAt : null;
                        firstListing = listings.length > 0 ? listings[0].createdAt : null;
                        firstReview = reviews.length > 0 ? reviews[0].createdAt : null;
                        timeToFirstBooking = firstInteraction && firstBooking
                            ? Math.ceil((firstBooking.getTime() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24))
                            : null;
                        timeToFirstListing = firstInteraction && firstListing
                            ? Math.ceil((firstListing.getTime() - firstInteraction.getTime()) / (1000 * 60 * 60 * 24))
                            : null;
                        userType = 'visitor';
                        if (bookings.length > 0 && listings.length > 0) {
                            userType = 'power_user';
                        }
                        else if (bookings.length > 0) {
                            userType = 'renter';
                        }
                        else if (listings.length > 0) {
                            userType = 'owner';
                        }
                        return [2 /*return*/, {
                                userType: userType,
                                journeyMilestones: {
                                    firstInteraction: firstInteraction,
                                    firstBooking: firstBooking,
                                    firstListing: firstListing,
                                    firstReview: firstReview
                                },
                                timeToActions: {
                                    timeToFirstBooking: timeToFirstBooking,
                                    timeToFirstListing: timeToFirstListing
                                },
                                activityCounts: {
                                    interactions: interactions.length,
                                    bookings: bookings.length,
                                    listings: listings.length,
                                    reviews: reviews.length
                                }
                            }];
                    case 7:
                        error_38 = _b.sent();
                        console.error('Error getting user journey analytics:', error_38);
                        return [2 /*return*/, {
                                userType: 'unknown',
                                journeyMilestones: {
                                    firstInteraction: null,
                                    firstBooking: null,
                                    firstListing: null,
                                    firstReview: null
                                },
                                timeToActions: {
                                    timeToFirstBooking: null,
                                    timeToFirstListing: null
                                },
                                activityCounts: {
                                    interactions: 0,
                                    bookings: 0,
                                    listings: 0,
                                    reviews: 0
                                }
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get engagement analytics
     * @param userId Optional user ID
     * @returns Engagement analytics data
     */
    RenAIService.prototype.getEngagementAnalytics = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, thirtyDaysAgo, recentInteractions, recentBookings, recentListings, _a, interactionScore, bookingScore, listingScore, totalScore, engagementLevel, dailyActivity_1, error_39;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        whereClause = userId ? { userId: userId } : {};
                        thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: __assign(__assign({}, whereClause), { createdAt: { gte: thirtyDaysAgo } })
                            })];
                    case 1:
                        recentInteractions = _b.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: __assign(__assign({}, whereClause), { createdAt: { gte: thirtyDaysAgo } })
                            })];
                    case 2:
                        recentBookings = _b.sent();
                        if (!userId) return [3 /*break*/, 4];
                        return [4 /*yield*/, prisma.listing.findMany({
                                where: {
                                    ownerId: userId,
                                    createdAt: { gte: thirtyDaysAgo }
                                }
                            })];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = [];
                        _b.label = 5;
                    case 5:
                        recentListings = _a;
                        interactionScore = recentInteractions.length;
                        bookingScore = recentBookings.length * 2;
                        listingScore = recentListings.length * 3;
                        totalScore = interactionScore + bookingScore + listingScore;
                        engagementLevel = totalScore > 20 ? 'high' : totalScore > 10 ? 'medium' : 'low';
                        dailyActivity_1 = {};
                        __spreadArray(__spreadArray(__spreadArray([], recentInteractions, true), recentBookings, true), recentListings, true).forEach(function (activity) {
                            var day = activity.createdAt.toISOString().split('T')[0];
                            dailyActivity_1[day] = (dailyActivity_1[day] || 0) + 1;
                        });
                        return [2 /*return*/, {
                                engagementLevel: engagementLevel,
                                engagementScore: totalScore,
                                activityBreakdown: {
                                    interactions: interactionScore,
                                    bookings: bookingScore,
                                    listings: listingScore
                                },
                                dailyActivity: dailyActivity_1,
                                period: "Last 30 days"
                            }];
                    case 6:
                        error_39 = _b.sent();
                        console.error('Error getting engagement analytics:', error_39);
                        return [2 /*return*/, {
                                engagementLevel: 'unknown',
                                engagementScore: 0,
                                activityBreakdown: {
                                    interactions: 0,
                                    bookings: 0,
                                    listings: 0
                                },
                                dailyActivity: {},
                                period: "Last 30 days"
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get conversion analytics
     * @param userId Optional user ID
     * @returns Conversion analytics data
     */
    RenAIService.prototype.getConversionAnalytics = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, interactions, actionCounts_1, totalConversions_1, totalInteractions, conversionRate, error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        whereClause = userId ? { userId: userId } : {};
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: whereClause,
                                select: { actionTaken: true, createdAt: true }
                            })];
                    case 1:
                        interactions = _a.sent();
                        actionCounts_1 = {};
                        totalConversions_1 = 0;
                        interactions.forEach(function (interaction) {
                            if (interaction.actionTaken) {
                                var actionType = interaction.actionTaken.split(':')[0];
                                actionCounts_1[actionType] = (actionCounts_1[actionType] || 0) + 1;
                                // Count conversions (booking, listing, payment actions)
                                if (['booking', 'listing', 'payment'].includes(actionType)) {
                                    totalConversions_1++;
                                }
                            }
                        });
                        totalInteractions = interactions.length;
                        conversionRate = totalInteractions > 0
                            ? parseFloat(((totalConversions_1 / totalInteractions) * 100).toFixed(2))
                            : 0;
                        return [2 /*return*/, {
                                totalInteractions: totalInteractions,
                                totalConversions: totalConversions_1,
                                conversionRate: conversionRate,
                                actionBreakdown: actionCounts_1
                            }];
                    case 2:
                        error_40 = _a.sent();
                        console.error('Error getting conversion analytics:', error_40);
                        return [2 /*return*/, {
                                totalInteractions: 0,
                                totalConversions: 0,
                                conversionRate: 0,
                                actionBreakdown: {}
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enhance booking management assistance
     * @param userId User ID
     * @param context Current AI context
     * @returns Booking management assistance data
     */
    RenAIService.prototype.enhanceBookingManagement = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, upcomingBookings, currentBookings, pastBookings, suggestions, bookingStats, error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        include: {
                                            owner: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                    case 1:
                        userBookings = _a.sent();
                        upcomingBookings = userBookings.filter(function (booking) {
                            return booking.startDate > new Date() && booking.status === 'confirmed';
                        });
                        currentBookings = userBookings.filter(function (booking) {
                            return booking.startDate <= new Date() && booking.endDate >= new Date() && booking.status === 'confirmed';
                        });
                        pastBookings = userBookings.filter(function (booking) {
                            return booking.endDate < new Date() || booking.status !== 'confirmed';
                        });
                        suggestions = this.generateBookingManagementSuggestions(upcomingBookings, currentBookings, pastBookings, context);
                        bookingStats = {
                            total: userBookings.length,
                            upcoming: upcomingBookings.length,
                            current: currentBookings.length,
                            past: pastBookings.length
                        };
                        return [2 /*return*/, {
                                bookingStats: bookingStats,
                                upcomingBookings: upcomingBookings.slice(0, 5), // Limit to 5 upcoming bookings
                                currentBookings: currentBookings.slice(0, 5), // Limit to 5 current bookings
                                recentPastBookings: pastBookings.slice(0, 5), // Limit to 5 recent past bookings
                                suggestions: suggestions,
                                lastUpdated: new Date()
                            }];
                    case 2:
                        error_41 = _a.sent();
                        console.error('Error enhancing booking management:', error_41);
                        throw error_41;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate booking management suggestions
     * @param upcomingBookings Upcoming bookings
     * @param currentBookings Current bookings
     * @param pastBookings Past bookings
     * @param context Current AI context
     * @returns Booking management suggestions
     */
    RenAIService.prototype.generateBookingManagementSuggestions = function (upcomingBookings, currentBookings, pastBookings, context) {
        var _a, _b;
        try {
            var suggestions = [];
            // Suggestions for upcoming bookings
            if (upcomingBookings.length > 0) {
                var nextBooking = upcomingBookings[0];
                var daysUntilBooking = Math.ceil((nextBooking.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysUntilBooking <= 3) {
                    suggestions.push("Your rental \"".concat(nextBooking.listing.title, "\" starts in ").concat(daysUntilBooking, " day(s). Contact ").concat(nextBooking.listing.owner.name, " to confirm pickup details."));
                }
                else if (daysUntilBooking <= 7) {
                    suggestions.push("Your rental \"".concat(nextBooking.listing.title, "\" starts next week. Plan accordingly!"));
                }
                // If user has multiple upcoming bookings
                if (upcomingBookings.length > 3) {
                    suggestions.push("You have ".concat(upcomingBookings.length, " upcoming bookings. Consider creating a rental calendar to keep track of them."));
                }
            }
            // Suggestions for current bookings
            if (currentBookings.length > 0) {
                var currentBooking = currentBookings[0];
                var daysRemaining = Math.ceil((currentBooking.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysRemaining <= 2) {
                    suggestions.push("Your rental \"".concat(currentBooking.listing.title, "\" is due in ").concat(daysRemaining, " day(s). Don't forget to return it on time!"));
                }
                // If user has multiple current bookings
                if (currentBookings.length > 1) {
                    suggestions.push("You currently have ".concat(currentBookings.length, " active rentals. Keep track of their return dates."));
                }
            }
            // Suggestions for past bookings
            if (pastBookings.length > 0) {
                var recentBooking = pastBookings[0];
                // Suggest leaving a review if not already done
                if (!recentBooking.reviewId) {
                    suggestions.push("You recently rented \"".concat(recentBooking.listing.title, "\". Consider leaving a review to help other renters."));
                }
                // Suggest rebooking popular items
                var popularItems = pastBookings
                    .filter(function (booking) { return booking.status === 'completed'; })
                    .map(function (booking) { return booking.listing; })
                    .filter(function (listing, index, self) {
                    return self.findIndex(function (l) { return l.id === listing.id; }) === index;
                })
                    .slice(0, 3);
                if (popularItems.length > 0) {
                    suggestions.push("You might want to rent similar items: ".concat(popularItems.map(function (item) { return item.title; }).join(', ')));
                }
            }
            // General suggestions based on booking history
            var totalCompletedBookings = pastBookings.filter(function (b) { return b.status === 'completed'; }).length;
            if (totalCompletedBookings > 10) {
                suggestions.push("You're a frequent renter! Consider becoming an owner to list your own items and earn extra income.");
            }
            else if (totalCompletedBookings > 5) {
                suggestions.push("You've completed several rentals. Keep building your rental history!");
            }
            // Suggestions based on user context
            if ((_b = (_a = context.userPreferences) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.length) {
                suggestions.push("Find more rentals in your favorite categories: ".concat(context.userPreferences.categories.slice(0, 3).join(', ')));
            }
            return suggestions;
        }
        catch (error) {
            console.error('Error generating booking management suggestions:', error);
            return [];
        }
    };
    /**
     * Add payment assistance features
     * @param userId User ID
     * @param context Current AI context
     * @returns Payment assistance data
     */
    RenAIService.prototype.addPaymentAssistance = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var userTransactions, upcomingPayments, totalSpent, averageSpent, paymentMethods, suggestions, securityInfo, error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.transaction.findMany({
                                where: { userId: userId },
                                include: {
                                    booking: {
                                        include: {
                                            listing: {
                                                select: {
                                                    id: true,
                                                    title: true,
                                                    price: true
                                                }
                                            }
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                    case 1:
                        userTransactions = _a.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    status: 'confirmed',
                                    startDate: { gte: new Date() }
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            price: true
                                        }
                                    }
                                },
                                orderBy: { startDate: 'asc' }
                            })];
                    case 2:
                        upcomingPayments = _a.sent();
                        totalSpent = userTransactions.reduce(function (sum, transaction) { return sum + transaction.amount; }, 0);
                        averageSpent = userTransactions.length > 0 ? totalSpent / userTransactions.length : 0;
                        paymentMethods = __spreadArray([], new Set(userTransactions.map(function (t) { return t.paymentMethod; })), true).filter(Boolean);
                        suggestions = this.generatePaymentAssistanceSuggestions(userTransactions, upcomingPayments, paymentMethods, context);
                        securityInfo = this.getPaymentSecurityInfo();
                        return [2 /*return*/, {
                                paymentStats: {
                                    totalTransactions: userTransactions.length,
                                    totalSpent: parseFloat(totalSpent.toFixed(2)),
                                    averageSpent: parseFloat(averageSpent.toFixed(2)),
                                    paymentMethods: paymentMethods
                                },
                                recentTransactions: userTransactions.slice(0, 5), // Limit to 5 recent transactions
                                upcomingPayments: upcomingPayments.slice(0, 5), // Limit to 5 upcoming payments
                                suggestions: suggestions,
                                securityInfo: securityInfo,
                                lastUpdated: new Date()
                            }];
                    case 3:
                        error_42 = _a.sent();
                        console.error('Error adding payment assistance:', error_42);
                        throw error_42;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate payment assistance suggestions
     * @param transactions User's transaction history
     * @param upcomingPayments Upcoming payments
     * @param paymentMethods Available payment methods
     * @param context Current AI context
     * @returns Payment assistance suggestions
     */
    RenAIService.prototype.generatePaymentAssistanceSuggestions = function (transactions, upcomingPayments, paymentMethods, context) {
        var _a;
        try {
            var suggestions = [];
            // Suggestions for upcoming payments
            if (upcomingPayments.length > 0) {
                var nextPayment = upcomingPayments[0];
                var daysUntilPayment = Math.ceil((nextPayment.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysUntilPayment <= 3) {
                    suggestions.push("Payment of \u20B1".concat(nextPayment.totalPrice, " for \"").concat(nextPayment.listing.title, "\" is due in ").concat(daysUntilPayment, " day(s). Ensure your payment method is ready."));
                }
                else if (daysUntilPayment <= 7) {
                    suggestions.push("Payment of \u20B1".concat(nextPayment.totalPrice, " for \"").concat(nextPayment.listing.title, "\" is due next week. Plan your budget accordingly."));
                }
                // If user has multiple upcoming payments
                if (upcomingPayments.length > 3) {
                    var totalUpcomingAmount = upcomingPayments.reduce(function (sum, payment) { return sum + payment.totalPrice; }, 0);
                    suggestions.push("You have ".concat(upcomingPayments.length, " upcoming payments totaling \u20B1").concat(totalUpcomingAmount.toFixed(2), ". Consider setting up payment reminders."));
                }
            }
            // Suggestions based on transaction history
            if (transactions.length > 0) {
                var recentTransactions = transactions.slice(0, 5);
                var totalRecentSpent = recentTransactions.reduce(function (sum, t) { return sum + t.amount; }, 0);
                if (totalRecentSpent > 5000) {
                    suggestions.push("You've spent \u20B1".concat(totalRecentSpent.toFixed(2), " recently on rentals. Consider setting a monthly rental budget."));
                }
                // Suggest payment method optimization
                if (paymentMethods.length > 1) {
                    suggestions.push("You've used ".concat(paymentMethods.length, " different payment methods. Consider using your preferred method for faster checkouts."));
                }
                else if (paymentMethods.length === 1) {
                    suggestions.push("You primarily use ".concat(paymentMethods[0], " for payments. Consider adding a backup payment method for reliability."));
                }
            }
            // General payment tips
            suggestions.push("All payments are securely processed and held until after your rental period ends.");
            suggestions.push("You can view your complete payment history in your account settings.");
            // Suggestions based on user context
            if ((_a = context.userPreferences) === null || _a === void 0 ? void 0 : _a.priceRange) {
                suggestions.push("Based on your preferences, rentals in the \u20B1".concat(context.userPreferences.priceRange.min, "-\u20B1").concat(context.userPreferences.priceRange.max, " range might fit your budget."));
            }
            return suggestions;
        }
        catch (error) {
            console.error('Error generating payment assistance suggestions:', error);
            return [];
        }
    };
    /**
     * Get payment security information
     * @returns Payment security information
     */
    RenAIService.prototype.getPaymentSecurityInfo = function () {
        return {
            encryption: "All payments are encrypted using industry-standard SSL/TLS protocols",
            protection: "Payments are held securely until after your rental period ends",
            refundPolicy: "Refunds are processed according to our cancellation policy",
            disputeResolution: "Disputes are handled through our mediation process",
            dataProtection: "Your payment information is never shared with third parties"
        };
    };
    /**
     * Implement review and rating system assistance
     * @param userId User ID
     * @param context Current AI context
     * @returns Review and rating assistance data
     */
    RenAIService.prototype.implementReviewAssistance = function (userId, context) {
        return __awaiter(this, void 0, void 0, function () {
            var userReviews, completedBookingsWithoutReviews, averageRating, suggestions, reviewGuidelines, error_43;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.review.findMany({
                                where: { userId: userId },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                    case 1:
                        userReviews = _a.sent();
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: {
                                    userId: userId,
                                    status: 'completed',
                                    review: null
                                },
                                include: {
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                },
                                orderBy: { endDate: 'desc' }
                            })];
                    case 2:
                        completedBookingsWithoutReviews = _a.sent();
                        averageRating = userReviews.length > 0
                            ? userReviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / userReviews.length
                            : 0;
                        suggestions = this.generateReviewAssistanceSuggestions(userReviews, completedBookingsWithoutReviews, context);
                        reviewGuidelines = this.getReviewGuidelines();
                        return [2 /*return*/, {
                                reviewStats: {
                                    totalReviews: userReviews.length,
                                    averageRating: parseFloat(averageRating.toFixed(2)),
                                    ratingsDistribution: this.getRatingsDistribution(userReviews)
                                },
                                recentReviews: userReviews.slice(0, 5), // Limit to 5 recent reviews
                                listingsNeedingReviews: completedBookingsWithoutReviews.slice(0, 5), // Limit to 5 listings needing reviews
                                suggestions: suggestions,
                                reviewGuidelines: reviewGuidelines,
                                lastUpdated: new Date()
                            }];
                    case 3:
                        error_43 = _a.sent();
                        console.error('Error implementing review assistance:', error_43);
                        throw error_43;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate review assistance suggestions
     * @param reviews User's reviews
     * @param listingsNeedingReviews Listings that need reviews
     * @param context Current AI context
     * @returns Review assistance suggestions
     */
    RenAIService.prototype.generateReviewAssistanceSuggestions = function (reviews, listingsNeedingReviews, context) {
        var _a, _b;
        try {
            var suggestions = [];
            // Suggestions for listings needing reviews
            if (listingsNeedingReviews.length > 0) {
                var listing = listingsNeedingReviews[0];
                suggestions.push("You recently rented \"".concat(listing.listing.title, "\" and haven't left a review yet. Your feedback helps other renters!"));
                // If user has multiple listings needing reviews
                if (listingsNeedingReviews.length > 3) {
                    suggestions.push("You have ".concat(listingsNeedingReviews.length, " rentals that need reviews. Consider leaving feedback for all of them."));
                }
            }
            // Suggestions based on review history
            if (reviews.length > 0) {
                var recentReviews = reviews.slice(0, 3);
                // Check for review patterns
                var avgRecentRating = recentReviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / recentReviews.length;
                if (avgRecentRating < 3) {
                    suggestions.push("Your recent reviews have been critical. Consider highlighting positive aspects when appropriate.");
                }
                else if (avgRecentRating > 4) {
                    suggestions.push("Your recent reviews have been very positive. Keep up the constructive feedback!");
                }
                // Suggest reviewing patterns
                if (reviews.length > 10) {
                    suggestions.push("You're an active reviewer! Your feedback helps build a trustworthy community.");
                }
            }
            else {
                suggestions.push("Leave your first review to help build a trustworthy community!");
            }
            // General review tips
            suggestions.push("Be specific and constructive in your reviews to help others make informed decisions.");
            suggestions.push("Include details about the item's condition, accuracy of description, and owner's communication.");
            // Suggestions based on user context
            if ((_b = (_a = context.userPreferences) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.length) {
                suggestions.push("Share your experience with rentals in categories like: ".concat(context.userPreferences.categories.slice(0, 3).join(', ')));
            }
            return suggestions;
        }
        catch (error) {
            console.error('Error generating review assistance suggestions:', error);
            return [];
        }
    };
    /**
     * Get ratings distribution
     * @param reviews Array of reviews
     * @returns Ratings distribution
     */
    RenAIService.prototype.getRatingsDistribution = function (reviews) {
        var distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(function (review) {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating]++;
            }
        });
        return distribution;
    };
    /**
     * Get review guidelines
     * @returns Review guidelines
     */
    RenAIService.prototype.getReviewGuidelines = function () {
        return {
            helpfulReviews: [
                "Be honest and specific about your experience",
                "Mention both positive and negative aspects",
                "Include details about the item's condition and accuracy of description",
                "Comment on the owner's communication and reliability",
                "Avoid personal attacks or offensive language"
            ],
            ratingCriteria: {
                5: "Excellent - Exceeded expectations in all aspects",
                4: "Good - Met expectations with minor issues",
                3: "Average - Met basic expectations",
                2: "Poor - Significant issues that affected the experience",
                1: "Terrible - Major problems or misleading information"
            },
            communityGuidelines: [
                "Reviews must be based on actual rental experiences",
                "No fake or biased reviews",
                "Respect privacy - don't share personal information",
                "Constructive criticism is encouraged",
                "Report inappropriate reviews to support"
            ]
        };
    };
    /**
     * Get predictive navigation suggestions based on user activity
     * @param userId The user ID to get suggestions for
     * @returns Array of navigation suggestions
     */
    RenAIService.prototype.getPredictiveNavigationSuggestions = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userActivity, activityPatterns, activityFrequency_1, suggestions, navigationSuggestions, error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        userActivity = _a.sent();
                        activityPatterns = userActivity.map(function (activity) { return activity.type; });
                        activityFrequency_1 = activityPatterns.reduce(function (acc, type) {
                            acc[type] = (acc[type] || 0) + 1;
                            return acc;
                        }, {});
                        suggestions = Object.keys(activityFrequency_1).map(function (type) { return ({
                            type: type,
                            priority: activityFrequency_1[type]
                        }); }).sort(function (a, b) { return b.priority - a.priority; });
                        navigationSuggestions = suggestions.map(function (suggestion) {
                            switch (suggestion.type) {
                                case 'booking':
                                    return { type: 'booking', message: 'Explore more listings to book', priority: suggestion.priority };
                                case 'listing':
                                    return { type: 'listing', message: 'Create a new listing', priority: suggestion.priority };
                                case 'review':
                                    return { type: 'review', message: 'Write a review for your recent booking', priority: suggestion.priority };
                                case 'wishlist':
                                    return { type: 'wishlist', message: 'Add items to your wishlist', priority: suggestion.priority };
                                case 'payment':
                                    return { type: 'payment', message: 'Manage your payment methods', priority: suggestion.priority };
                                default:
                                    return { type: 'unknown', message: 'Explore more features', priority: suggestion.priority };
                            }
                        });
                        return [2 /*return*/, navigationSuggestions];
                    case 2:
                        error_44 = _a.sent();
                        console.error('Error getting predictive navigation suggestions:', error_44);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user engagement metrics
     * @param userId The user ID to get metrics for (optional)
     * @returns User engagement metrics
     */
    RenAIService.prototype.getUserEngagementMetrics = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userActivityData, engagementLevels, totalActivities, retentionData, error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userActivityData = null;
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        userActivityData = _a.sent();
                        _a.label = 2;
                    case 2:
                        engagementLevels = {
                            high: 0,
                            medium: 0,
                            low: 0
                        };
                        if (userId && userActivityData) {
                            totalActivities = userActivityData.recentBookings.length +
                                userActivityData.wishlistItems.length +
                                userActivityData.unreadMessages +
                                userActivityData.recentReviews.length +
                                userActivityData.recentListings.length;
                            if (totalActivities > 20) {
                                engagementLevels.high = 1;
                            }
                            else if (totalActivities > 10) {
                                engagementLevels.medium = 1;
                            }
                            else {
                                engagementLevels.low = 1;
                            }
                        }
                        else if (!userId) {
                            // For all users, get engagement distribution
                            // This would require more complex queries in a real implementation
                            engagementLevels.high = 0;
                            engagementLevels.medium = 0;
                            engagementLevels.low = 0;
                        }
                        retentionData = {
                            daily: 0,
                            weekly: 0,
                            monthly: 0
                        };
                        return [2 /*return*/, {
                                engagementLevels: engagementLevels,
                                retentionData: retentionData,
                                userActivity: userActivityData
                            }];
                    case 3:
                        error_45 = _a.sent();
                        console.error('Error getting user engagement metrics:', error_45);
                        return [2 /*return*/, {
                                engagementLevels: { high: 0, medium: 0, low: 0 },
                                retentionData: { daily: 0, weekly: 0, monthly: 0 },
                                userActivity: null
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get conversion funnel data
     * @param userId The user ID to get data for (optional)
     * @returns Conversion funnel data
     */
    RenAIService.prototype.getConversionFunnelData = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var funnelStages, userActivity, _a, _b, _c, _d, conversionRates, error_46;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 8, , 9]);
                        funnelStages = {
                            visitors: 0,
                            viewers: 0,
                            wishlists: 0,
                            bookings: 0
                        };
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        userActivity = _e.sent();
                        funnelStages.visitors = 1; // The user themselves
                        funnelStages.viewers = userActivity.recentBookings.length > 0 ? 1 : 0;
                        funnelStages.wishlists = userActivity.wishlistItems.length > 0 ? 1 : 0;
                        funnelStages.bookings = userActivity.recentBookings.length > 0 ? 1 : 0;
                        return [3 /*break*/, 7];
                    case 2:
                        // For all users (simplified)
                        _a = funnelStages;
                        return [4 /*yield*/, prisma.user.count()];
                    case 3:
                        // For all users (simplified)
                        _a.visitors = _e.sent();
                        _b = funnelStages;
                        return [4 /*yield*/, prisma.booking.count()];
                    case 4:
                        _b.viewers = _e.sent();
                        _c = funnelStages;
                        return [4 /*yield*/, prisma.wishlist.count()];
                    case 5:
                        _c.wishlists = _e.sent();
                        _d = funnelStages;
                        return [4 /*yield*/, prisma.booking.count({
                                where: { status: 'completed' }
                            })];
                    case 6:
                        _d.bookings = _e.sent();
                        _e.label = 7;
                    case 7:
                        conversionRates = {
                            visitorToViewer: funnelStages.visitors > 0
                                ? ((funnelStages.viewers / funnelStages.visitors) * 100).toFixed(2)
                                : "0.00",
                            viewerToWishlist: funnelStages.viewers > 0
                                ? ((funnelStages.wishlists / funnelStages.viewers) * 100).toFixed(2)
                                : "0.00",
                            wishlistToBooking: funnelStages.wishlists > 0
                                ? ((funnelStages.bookings / funnelStages.wishlists) * 100).toFixed(2)
                                : "0.00"
                        };
                        return [2 /*return*/, {
                                funnelStages: funnelStages,
                                conversionRates: conversionRates
                            }];
                    case 8:
                        error_46 = _e.sent();
                        console.error('Error getting conversion funnel data:', error_46);
                        return [2 /*return*/, {
                                funnelStages: { visitors: 0, viewers: 0, wishlists: 0, bookings: 0 },
                                conversionRates: { visitorToViewer: "0.00", viewerToWishlist: "0.00", wishlistToBooking: "0.00" }
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get sentiment analysis data
     * @param userId The user ID to get data for (optional)
     * @returns Sentiment analysis data
     */
    RenAIService.prototype.getSentimentAnalysis = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, interactions, sentimentCounts_1, positiveKeywords_1, negativeKeywords_1, totalInteractions, error_47;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        whereClause = userId ? { userId: userId } : {};
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: whereClause,
                                select: { userInput: true }
                            })];
                    case 1:
                        interactions = _a.sent();
                        sentimentCounts_1 = {
                            positive: 0,
                            negative: 0,
                            neutral: 0
                        };
                        positiveKeywords_1 = [
                            'great', 'awesome', 'excellent', 'wonderful', 'fantastic', 'amazing', 'love', 'like',
                            'perfect', 'good', 'nice', 'thank', 'thanks', 'happy', 'pleased', 'satisfied', 'cool'
                        ];
                        negativeKeywords_1 = [
                            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'angry',
                            'frustrated', 'annoyed', 'upset', 'disappointed', 'confused', 'difficult'
                        ];
                        interactions.forEach(function (interaction) {
                            var lowerInput = interaction.userInput.toLowerCase();
                            var positiveMatches = positiveKeywords_1.filter(function (keyword) { return lowerInput.includes(keyword); });
                            var negativeMatches = negativeKeywords_1.filter(function (keyword) { return lowerInput.includes(keyword); });
                            if (positiveMatches.length > negativeMatches.length) {
                                sentimentCounts_1.positive++;
                            }
                            else if (negativeMatches.length > positiveMatches.length) {
                                sentimentCounts_1.negative++;
                            }
                            else {
                                sentimentCounts_1.neutral++;
                            }
                        });
                        totalInteractions = interactions.length;
                        return [2 /*return*/, {
                                sentimentCounts: sentimentCounts_1,
                                sentimentPercentages: {
                                    positive: totalInteractions > 0
                                        ? ((sentimentCounts_1.positive / totalInteractions) * 100).toFixed(2)
                                        : "0.00",
                                    negative: totalInteractions > 0
                                        ? ((sentimentCounts_1.negative / totalInteractions) * 100).toFixed(2)
                                        : "0.00",
                                    neutral: totalInteractions > 0
                                        ? ((sentimentCounts_1.neutral / totalInteractions) * 100).toFixed(2)
                                        : "0.00"
                                },
                                totalInteractions: totalInteractions
                            }];
                    case 2:
                        error_47 = _a.sent();
                        console.error('Error getting sentiment analysis:', error_47);
                        return [2 /*return*/, {
                                sentimentCounts: { positive: 0, negative: 0, neutral: 0 },
                                sentimentPercentages: { positive: "0.00", negative: "0.00", neutral: "0.00" },
                                totalInteractions: 0
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement automated A/B testing for response strategies
     * @param testConfig Configuration for the A/B test
     * @returns Test results and recommendations
     */
    RenAIService.prototype.implementABTesting = function (testConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var testRecord, testResults, recommendations, error_48;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.aBTest.upsert({
                                where: { testName: testConfig.testName },
                                update: {
                                    variants: JSON.stringify(testConfig.variants),
                                    durationDays: testConfig.durationDays,
                                    metrics: JSON.stringify(testConfig.metrics),
                                    updatedAt: new Date()
                                },
                                create: {
                                    testName: testConfig.testName,
                                    variants: JSON.stringify(testConfig.variants),
                                    durationDays: testConfig.durationDays,
                                    metrics: JSON.stringify(testConfig.metrics),
                                    startDate: new Date(),
                                    status: 'active'
                                }
                            })];
                    case 1:
                        testRecord = _a.sent();
                        return [4 /*yield*/, this.getABTestResults(testConfig.testName)];
                    case 2:
                        testResults = _a.sent();
                        recommendations = this.analyzeABTestResults(testResults);
                        return [2 /*return*/, {
                                testId: testRecord.id,
                                testName: testConfig.testName,
                                status: testRecord.status,
                                results: testResults,
                                recommendations: recommendations
                            }];
                    case 3:
                        error_48 = _a.sent();
                        console.error('Error implementing A/B testing:', error_48);
                        throw error_48;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get A/B test results
     * @param testName The name of the test to get results for
     * @returns Test results
     */
    RenAIService.prototype.getABTestResults = function (testName) {
        return __awaiter(this, void 0, void 0, function () {
            var testRecord, variants, variantResults, _i, variants_1, variant, interactions, interactionIds, feedback, interactionCount, avgRating, conversions, conversionRate, error_49;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, prisma.aBTest.findUnique({
                                where: { testName: testName }
                            })];
                    case 1:
                        testRecord = _a.sent();
                        if (!testRecord) {
                            return [2 /*return*/, null];
                        }
                        variants = JSON.parse(testRecord.variants || '[]');
                        variantResults = [];
                        _i = 0, variants_1 = variants;
                        _a.label = 2;
                    case 2:
                        if (!(_i < variants_1.length)) return [3 /*break*/, 6];
                        variant = variants_1[_i];
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: {
                                    actionTaken: {
                                        contains: "variant:".concat(variant.name)
                                    },
                                    createdAt: {
                                        gte: testRecord.startDate,
                                        lte: new Date(testRecord.startDate.getTime() + testRecord.durationDays * 24 * 60 * 60 * 1000)
                                    }
                                }
                            })];
                    case 3:
                        interactions = _a.sent();
                        interactionIds = interactions.map(function (i) { return i.id; });
                        return [4 /*yield*/, prisma.aIFeedback.findMany({
                                where: {
                                    messageId: { in: interactionIds }
                                }
                            })];
                    case 4:
                        feedback = _a.sent();
                        interactionCount = interactions.length;
                        avgRating = feedback.length > 0
                            ? feedback.reduce(function (sum, f) { return sum + f.rating; }, 0) / feedback.length
                            : 0;
                        conversions = interactions.filter(function (i) {
                            return i.actionTaken && i.actionTaken.includes('conversion');
                        }).length;
                        conversionRate = interactionCount > 0
                            ? (conversions / interactionCount) * 100
                            : 0;
                        variantResults.push({
                            variantName: variant.name,
                            interactionCount: interactionCount,
                            avgRating: parseFloat(avgRating.toFixed(2)),
                            conversionRate: parseFloat(conversionRate.toFixed(2))
                        });
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, {
                            testName: testName,
                            startDate: testRecord.startDate,
                            durationDays: testRecord.durationDays,
                            variants: variantResults,
                            status: testRecord.status
                        }];
                    case 7:
                        error_49 = _a.sent();
                        console.error('Error getting A/B test results:', error_49);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze A/B test results and generate recommendations
     * @param testResults The test results to analyze
     * @returns Analysis and recommendations
     */
    RenAIService.prototype.analyzeABTestResults = function (testResults) {
        if (!testResults || !testResults.variants || testResults.variants.length === 0) {
            return {
                recommendation: "Insufficient data for analysis",
                confidence: 0
            };
        }
        // Find the best performing variant based on multiple metrics
        var variants = testResults.variants;
        // Sort by average rating (primary metric)
        var sortedByRating = __spreadArray([], variants, true).sort(function (a, b) { return b.avgRating - a.avgRating; });
        var bestByRating = sortedByRating[0];
        // Sort by conversion rate (secondary metric)
        var sortedByConversion = __spreadArray([], variants, true).sort(function (a, b) { return b.conversionRate - a.conversionRate; });
        var bestByConversion = sortedByConversion[0];
        // Calculate statistical significance (simplified)
        var avgRatingDiff = Math.abs(bestByRating.avgRating - sortedByRating[sortedByRating.length - 1].avgRating);
        var conversionDiff = Math.abs(bestByConversion.conversionRate - sortedByConversion[sortedByConversion.length - 1].conversionRate);
        var ratingConfidence = avgRatingDiff > 0.5 ? 0.9 : avgRatingDiff > 0.2 ? 0.7 : 0.5;
        var conversionConfidence = conversionDiff > 10 ? 0.9 : conversionDiff > 5 ? 0.7 : 0.5;
        var overallConfidence = (ratingConfidence + conversionConfidence) / 2;
        // Generate recommendation
        var recommendation = "";
        if (bestByRating.avgRating > bestByConversion.avgRating) {
            recommendation = "Recommend using variant \"".concat(bestByRating.variantName, "\" which achieved the highest user satisfaction rating of ").concat(bestByRating.avgRating, ".");
        }
        else {
            recommendation = "Recommend using variant \"".concat(bestByConversion.variantName, "\" which achieved the highest conversion rate of ").concat(bestByConversion.conversionRate, "%.");
        }
        // If both metrics favor the same variant, stronger recommendation
        if (bestByRating.variantName === bestByConversion.variantName) {
            recommendation = "Strongly recommend using variant \"".concat(bestByRating.variantName, "\" which performed best on both user satisfaction (").concat(bestByRating.avgRating, " rating) and conversion rate (").concat(bestByConversion.conversionRate, "%).");
        }
        return {
            recommendation: recommendation,
            confidence: parseFloat(overallConfidence.toFixed(2)),
            metrics: {
                bestByRating: {
                    variant: bestByRating.variantName,
                    rating: bestByRating.avgRating
                },
                bestByConversion: {
                    variant: bestByConversion.variantName,
                    rate: bestByConversion.conversionRate
                }
            }
        };
    };
    /**
     * Implement automated A/B testing for response strategies
     * @param testConfig Configuration for the A/B test
     * @returns Test results and recommendations
     */
    RenAIService.prototype.implementABTesting = function (testConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var testRecord, testResults, recommendations, error_50;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.aBTest.upsert({
                                where: { testName: testConfig.testName },
                                update: {
                                    variants: JSON.stringify(testConfig.variants),
                                    durationDays: testConfig.durationDays,
                                    metrics: JSON.stringify(testConfig.metrics),
                                    updatedAt: new Date()
                                },
                                create: {
                                    testName: testConfig.testName,
                                    variants: JSON.stringify(testConfig.variants),
                                    durationDays: testConfig.durationDays,
                                    metrics: JSON.stringify(testConfig.metrics),
                                    startDate: new Date(),
                                    status: 'active'
                                }
                            })];
                    case 1:
                        testRecord = _a.sent();
                        return [4 /*yield*/, this.getABTestResults(testConfig.testName)];
                    case 2:
                        testResults = _a.sent();
                        recommendations = this.analyzeABTestResults(testResults);
                        return [2 /*return*/, {
                                testId: testRecord.id,
                                testName: testConfig.testName,
                                status: testRecord.status,
                                results: testResults,
                                recommendations: recommendations
                            }];
                    case 3:
                        error_50 = _a.sent();
                        console.error('Error implementing A/B testing:', error_50);
                        throw error_50;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get A/B test results
     * @param testName The name of the test to get results for
     * @returns Test results
     */
    RenAIService.prototype.getABTestResults = function (testName) {
        return __awaiter(this, void 0, void 0, function () {
            var testRecord, variants, variantResults, _i, variants_2, variant, interactions, interactionIds, feedback, interactionCount, avgRating, conversions, conversionRate, error_51;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, prisma.aBTest.findUnique({
                                where: { testName: testName }
                            })];
                    case 1:
                        testRecord = _a.sent();
                        if (!testRecord) {
                            return [2 /*return*/, null];
                        }
                        variants = JSON.parse(testRecord.variants || '[]');
                        variantResults = [];
                        _i = 0, variants_2 = variants;
                        _a.label = 2;
                    case 2:
                        if (!(_i < variants_2.length)) return [3 /*break*/, 6];
                        variant = variants_2[_i];
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: {
                                    actionTaken: {
                                        contains: "variant:".concat(variant.name)
                                    },
                                    createdAt: {
                                        gte: testRecord.startDate,
                                        lte: new Date(testRecord.startDate.getTime() + testRecord.durationDays * 24 * 60 * 60 * 1000)
                                    }
                                }
                            })];
                    case 3:
                        interactions = _a.sent();
                        interactionIds = interactions.map(function (i) { return i.id; });
                        return [4 /*yield*/, prisma.aIFeedback.findMany({
                                where: {
                                    messageId: { in: interactionIds }
                                }
                            })];
                    case 4:
                        feedback = _a.sent();
                        interactionCount = interactions.length;
                        avgRating = feedback.length > 0
                            ? feedback.reduce(function (sum, f) { return sum + f.rating; }, 0) / feedback.length
                            : 0;
                        conversions = interactions.filter(function (i) {
                            return i.actionTaken && i.actionTaken.includes('conversion');
                        }).length;
                        conversionRate = interactionCount > 0
                            ? (conversions / interactionCount) * 100
                            : 0;
                        variantResults.push({
                            variantName: variant.name,
                            interactionCount: interactionCount,
                            avgRating: parseFloat(avgRating.toFixed(2)),
                            conversionRate: parseFloat(conversionRate.toFixed(2))
                        });
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, {
                            testName: testName,
                            startDate: testRecord.startDate,
                            durationDays: testRecord.durationDays,
                            variants: variantResults,
                            status: testRecord.status
                        }];
                    case 7:
                        error_51 = _a.sent();
                        console.error('Error getting A/B test results:', error_51);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze A/B test results and generate recommendations
     * @param testResults The test results to analyze
     * @returns Analysis and recommendations
     */
    RenAIService.prototype.analyzeABTestResults = function (testResults) {
        if (!testResults || !testResults.variants || testResults.variants.length === 0) {
            return {
                recommendation: "Insufficient data for analysis",
                confidence: 0
            };
        }
        // Find the best performing variant based on multiple metrics
        var variants = testResults.variants;
        // Sort by average rating (primary metric)
        var sortedByRating = __spreadArray([], variants, true).sort(function (a, b) { return b.avgRating - a.avgRating; });
        var bestByRating = sortedByRating[0];
        // Sort by conversion rate (secondary metric)
        var sortedByConversion = __spreadArray([], variants, true).sort(function (a, b) { return b.conversionRate - a.conversionRate; });
        var bestByConversion = sortedByConversion[0];
        // Calculate statistical significance (simplified)
        var avgRatingDiff = Math.abs(bestByRating.avgRating - sortedByRating[sortedByRating.length - 1].avgRating);
        var conversionDiff = Math.abs(bestByConversion.conversionRate - sortedByConversion[sortedByConversion.length - 1].conversionRate);
        var ratingConfidence = avgRatingDiff > 0.5 ? 0.9 : avgRatingDiff > 0.2 ? 0.7 : 0.5;
        var conversionConfidence = conversionDiff > 10 ? 0.9 : conversionDiff > 5 ? 0.7 : 0.5;
        var overallConfidence = (ratingConfidence + conversionConfidence) / 2;
        // Generate recommendation
        var recommendation = "";
        if (bestByRating.avgRating > bestByConversion.avgRating) {
            recommendation = "Recommend using variant \"".concat(bestByRating.variantName, "\" which achieved the highest user satisfaction rating of ").concat(bestByRating.avgRating, ".");
        }
        else {
            recommendation = "Recommend using variant \"".concat(bestByConversion.variantName, "\" which achieved the highest conversion rate of ").concat(bestByConversion.conversionRate, "%.");
        }
        // If both metrics favor the same variant, stronger recommendation
        if (bestByRating.variantName === bestByConversion.variantName) {
            recommendation = "Strongly recommend using variant \"".concat(bestByRating.variantName, "\" which performed best on both user satisfaction (").concat(bestByRating.avgRating, " rating) and conversion rate (").concat(bestByConversion.conversionRate, "%).");
        }
        return {
            recommendation: recommendation,
            confidence: parseFloat(overallConfidence.toFixed(2)),
            metrics: {
                bestByRating: {
                    variant: bestByRating.variantName,
                    rating: bestByRating.avgRating
                },
                bestByConversion: {
                    variant: bestByConversion.variantName,
                    rate: bestByConversion.conversionRate
                }
            }
        };
    };
    /**
     * Implement continuous learning from user feedback
     * @param feedbackData User feedback data
     * @returns Learning results and updates
     */
    RenAIService.prototype.implementContinuousLearning = function (feedbackData) {
        return __awaiter(this, void 0, void 0, function () {
            var allFeedback, feedbackAnalysis, behaviorUpdates, learningReport, error_52;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!feedbackData) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma.aIFeedback.create({
                                data: {
                                    userId: feedbackData.userId,
                                    rating: feedbackData.rating || 0,
                                    comment: feedbackData.comment,
                                    messageId: "manual_feedback_".concat(Date.now()),
                                    createdAt: new Date()
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, prisma.aIFeedback.findMany({
                            include: { user: true }
                        })];
                    case 3:
                        allFeedback = _a.sent();
                        feedbackAnalysis = this.analyzeFeedbackPatterns(allFeedback);
                        return [4 /*yield*/, this.updateAIBehaviorFromFeedback(feedbackAnalysis)];
                    case 4:
                        behaviorUpdates = _a.sent();
                        learningReport = {
                            totalFeedback: allFeedback.length,
                            averageRating: feedbackAnalysis.averageRating,
                            commonIssues: feedbackAnalysis.commonIssues,
                            behaviorUpdates: behaviorUpdates,
                            lastUpdated: new Date()
                        };
                        return [2 /*return*/, learningReport];
                    case 5:
                        error_52 = _a.sent();
                        console.error('Error implementing continuous learning:', error_52);
                        throw error_52;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze feedback patterns
     * @param feedbackData Array of feedback data
     * @returns Analysis results
     */
    RenAIService.prototype.analyzeFeedbackPatterns = function (feedbackData) {
        try {
            // Calculate average rating
            var totalRating = feedbackData.reduce(function (sum, feedback) { return sum + feedback.rating; }, 0);
            var averageRating = feedbackData.length > 0 ? totalRating / feedbackData.length : 0;
            // Identify common issues from comments
            var comments = feedbackData
                .filter(function (f) { return f.comment; })
                .map(function (f) { return f.comment.toLowerCase(); });
            // Define common issue keywords
            var issueKeywords = {
                'navigation': ['navigate', 'find', 'lost', 'confused', 'where', 'path'],
                'response_quality': ['wrong', 'incorrect', 'bad', 'poor', 'unclear', 'confusing'],
                'speed': ['slow', 'fast', 'quick', 'delay'],
                'accuracy': ['accurate', 'inaccurate', 'wrong', 'correct', 'mistake'],
                'helpfulness': ['helpful', 'unhelpful', 'useful', 'useless', 'assist', 'support']
            };
            // Count issue occurrences
            var commonIssues = {};
            for (var _i = 0, _a = Object.entries(issueKeywords); _i < _a.length; _i++) {
                var _b = _a[_i], category = _b[0], keywords = _b[1];
                var count = 0;
                for (var _c = 0, comments_1 = comments; _c < comments_1.length; _c++) {
                    var comment = comments_1[_c];
                    for (var _d = 0, keywords_1 = keywords; _d < keywords_1.length; _d++) {
                        var keyword = keywords_1[_d];
                        if (comment.includes(keyword)) {
                            count++;
                            break;
                        }
                    }
                }
                commonIssues[category] = count;
            }
            // Get rating distribution
            var ratingDistribution = {
                1: feedbackData.filter(function (f) { return f.rating === 1; }).length,
                2: feedbackData.filter(function (f) { return f.rating === 2; }).length,
                3: feedbackData.filter(function (f) { return f.rating === 3; }).length,
                4: feedbackData.filter(function (f) { return f.rating === 4; }).length,
                5: feedbackData.filter(function (f) { return f.rating === 5; }).length
            };
            return {
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalFeedback: feedbackData.length,
                commonIssues: commonIssues,
                ratingDistribution: ratingDistribution
            };
        }
        catch (error) {
            console.error('Error analyzing feedback patterns:', error);
            return {
                averageRating: 0,
                totalFeedback: 0,
                commonIssues: {},
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }
    };
    /**
     * Update AI behavior based on feedback analysis
     * @param feedbackAnalysis Analysis results
     * @returns Behavior updates
     */
    RenAIService.prototype.updateAIBehaviorFromFeedback = function (feedbackAnalysis) {
        return __awaiter(this, void 0, void 0, function () {
            var updates;
            return __generator(this, function (_a) {
                try {
                    updates = [];
                    // If navigation issues are common, improve navigation assistance
                    if (feedbackAnalysis.commonIssues.navigation > feedbackAnalysis.totalFeedback * 0.1) {
                        updates.push("Enhanced navigation assistance and pathfinding capabilities");
                    }
                    // If response quality issues are common, improve response generation
                    if (feedbackAnalysis.commonIssues.response_quality > feedbackAnalysis.totalFeedback * 0.15) {
                        updates.push("Improved response accuracy and clarity");
                    }
                    // If speed issues are common, optimize processing
                    if (feedbackAnalysis.commonIssues.speed > feedbackAnalysis.totalFeedback * 0.1) {
                        updates.push("Optimized response generation speed");
                    }
                    // If accuracy issues are common, improve information retrieval
                    if (feedbackAnalysis.commonIssues.accuracy > feedbackAnalysis.totalFeedback * 0.1) {
                        updates.push("Enhanced information retrieval and fact-checking");
                    }
                    // If average rating is low, implement comprehensive improvements
                    if (feedbackAnalysis.averageRating < 3) {
                        updates.push("Comprehensive behavior review and improvement implementation");
                    }
                    // If average rating is high, reinforce successful patterns
                    if (feedbackAnalysis.averageRating >= 4) {
                        updates.push("Reinforced successful response patterns");
                    }
                    // Log behavior updates
                    if (updates.length > 0) {
                        console.log('AI Behavior Updates:', updates);
                    }
                    return [2 /*return*/, updates];
                }
                catch (error) {
                    console.error('Error updating AI behavior from feedback:', error);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Implement reinforcement learning capabilities
     * @param userId Optional user ID for personalized learning
     * @returns Reinforcement learning results
     */
    RenAIService.prototype.implementReinforcementLearning = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, interactions, interactionIds, feedback, feedbackMap_1, successfulInteractions, unsuccessfulInteractions, successPatterns, failurePatterns, modelUpdates, appliedUpdates, learningReport, error_53;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        whereClause = userId ? { userId: userId } : {};
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: whereClause,
                                include: { user: true },
                                orderBy: { createdAt: 'desc' },
                                take: 1000 // Limit to last 1000 interactions for performance
                            })];
                    case 1:
                        interactions = _a.sent();
                        interactionIds = interactions.map(function (i) { return i.id; });
                        return [4 /*yield*/, prisma.aIFeedback.findMany({
                                where: { messageId: { in: interactionIds } }
                            })];
                    case 2:
                        feedback = _a.sent();
                        feedbackMap_1 = new Map(feedback.map(function (f) { return [f.messageId, f]; }));
                        successfulInteractions = interactions.filter(function (interaction) {
                            var interactionFeedback = feedbackMap_1.get(interaction.id);
                            return interactionFeedback && interactionFeedback.rating >= 4;
                        });
                        unsuccessfulInteractions = interactions.filter(function (interaction) {
                            var interactionFeedback = feedbackMap_1.get(interaction.id);
                            return interactionFeedback && interactionFeedback.rating <= 2;
                        });
                        successPatterns = this.extractPatternsFromInteractions(successfulInteractions, 'success');
                        failurePatterns = this.extractPatternsFromInteractions(unsuccessfulInteractions, 'failure');
                        modelUpdates = this.generateReinforcementUpdates(successPatterns, failurePatterns);
                        return [4 /*yield*/, this.applyReinforcementUpdates(modelUpdates)];
                    case 3:
                        appliedUpdates = _a.sent();
                        learningReport = {
                            totalInteractions: interactions.length,
                            successfulInteractions: successfulInteractions.length,
                            unsuccessfulInteractions: unsuccessfulInteractions.length,
                            successRate: interactions.length > 0
                                ? parseFloat(((successfulInteractions.length / interactions.length) * 100).toFixed(2))
                                : 0,
                            extractedSuccessPatterns: successPatterns.length,
                            extractedFailurePatterns: failurePatterns.length,
                            modelUpdates: appliedUpdates,
                            lastUpdated: new Date()
                        };
                        return [2 /*return*/, learningReport];
                    case 4:
                        error_53 = _a.sent();
                        console.error('Error implementing reinforcement learning:', error_53);
                        throw error_53;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract patterns from interactions
     * @param interactions Array of interactions
     * @param type Type of interactions (success or failure)
     * @returns Extracted patterns
     */
    RenAIService.prototype.extractPatternsFromInteractions = function (interactions, type) {
        var _this = this;
        try {
            var patterns = [];
            // Group interactions by intent
            var intentGroups_1 = {};
            interactions.forEach(function (interaction) {
                // Classify intent from user input
                var intent = _this.classifyIntentFromInput(interaction.userInput);
                if (!intentGroups_1[intent]) {
                    intentGroups_1[intent] = [];
                }
                intentGroups_1[intent].push(interaction);
            });
            // Process each intent group
            for (var _i = 0, _a = Object.entries(intentGroups_1); _i < _a.length; _i++) {
                var _b = _a[_i], intent = _b[0], group = _b[1];
                var entities = this.extractEntitiesFromGroup(group);
                var responseStyle = this.determineResponseStyle(group);
                var actionTaken = this.determineActionTaken(group);
                var frequency = group.length;
                patterns.push({
                    intent: intent,
                    entities: entities,
                    responseStyle: responseStyle,
                    actionTaken: actionTaken,
                    frequency: frequency
                });
            }
            return patterns;
        }
        catch (error) {
            console.error('Error extracting patterns from interactions:', error);
            return [];
        }
    };
    /**
     * Generate reinforcement learning model updates
     * @param successPatterns Patterns from successful interactions
     * @param failurePatterns Patterns from unsuccessful interactions
     * @returns Model updates
     */
    RenAIService.prototype.generateReinforcementUpdates = function (successPatterns, failurePatterns) {
        try {
            var updates = [];
            // In a real implementation, this would:
            // 1. Compare success and failure patterns
            // 2. Identify differences and similarities
            // 3. Generate updates to improve the model
            // For now, we'll just log the patterns
            if (successPatterns.length > 0) {
                console.log('Success Patterns:', successPatterns);
            }
            if (failurePatterns.length > 0) {
                console.log('Failure Patterns:', failurePatterns);
            }
            return updates;
        }
        catch (error) {
            console.error('Error generating reinforcement updates:', error);
            return [];
        }
    };
    /**
     * Apply reinforcement updates to the model
     * @param updates Array of updates to apply
     * @returns Applied updates
     */
    RenAIService.prototype.applyReinforcementUpdates = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var error_54;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // In a real implementation, this would:
                        // 1. Update the AI model weights based on reinforcement learning
                        // 2. Adjust response templates and strategies
                        // 3. Modify intent classification parameters
                        // 4. Update entity extraction rules
                        // For now, we'll just log the updates
                        if (updates.length > 0) {
                            console.log('Reinforcement Learning Updates:', updates);
                        }
                        // Create a reinforcement learning record
                        return [4 /*yield*/, prisma.reinforcementLearningRecord.create({
                                data: {
                                    updates: JSON.stringify(updates),
                                    timestamp: new Date()
                                }
                            })];
                    case 1:
                        // Create a reinforcement learning record
                        _a.sent();
                        return [2 /*return*/, updates];
                    case 2:
                        error_54 = _a.sent();
                        console.error('Error applying reinforcement updates:', error_54);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement active learning to identify improvement areas
     * @param userId Optional user ID for personalized learning
     * @returns Active learning results and improvement suggestions
     */
    RenAIService.prototype.implementActiveLearning = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, interactions, interactionIds, feedback, feedbackMap, improvementAreas, improvementSuggestions, prioritizedImprovements, learningReport, error_55;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        whereClause = userId ? { userId: userId } : {};
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: whereClause,
                                include: { user: true },
                                orderBy: { createdAt: 'desc' },
                                take: 1000 // Limit to last 1000 interactions for performance
                            })];
                    case 1:
                        interactions = _a.sent();
                        interactionIds = interactions.map(function (i) { return i.id; });
                        return [4 /*yield*/, prisma.aIFeedback.findMany({
                                where: { messageId: { in: interactionIds } }
                            })];
                    case 2:
                        feedback = _a.sent();
                        feedbackMap = new Map(feedback.map(function (f) { return [f.messageId, f]; }));
                        improvementAreas = this.identifyImprovementAreas(interactions, feedbackMap);
                        improvementSuggestions = this.generateImprovementSuggestions(interactions, feedbackMap, improvementAreas);
                        prioritizedImprovements = this.prioritizeImprovements(improvementSuggestions);
                        learningReport = {
                            totalInteractions: interactions.length,
                            totalFeedback: feedback.length,
                            improvementAreas: improvementAreas,
                            improvementSuggestions: prioritizedImprovements,
                            lastAnalyzed: new Date()
                        };
                        // Log the active learning results
                        return [4 /*yield*/, prisma.activeLearningRecord.create({
                                data: {
                                    userId: userId,
                                    results: JSON.stringify(learningReport),
                                    timestamp: new Date()
                                }
                            })];
                    case 3:
                        // Log the active learning results
                        _a.sent();
                        return [2 /*return*/, learningReport];
                    case 4:
                        error_55 = _a.sent();
                        console.error('Error implementing active learning:', error_55);
                        throw error_55;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Identify areas for improvement from interactions and feedback
     * @param interactions Array of interactions
     * @param feedbackMap Map of feedback by message ID
     * @returns Identified improvement areas
     */
    RenAIService.prototype.identifyImprovementAreas = function (interactions, feedbackMap) {
        try {
            var areas_1 = {};
            // Analyze interactions for common issues
            interactions.forEach(function (interaction) {
                var interactionFeedback = feedbackMap.get(interaction.id);
                // Check for low-rated interactions
                if (interactionFeedback && interactionFeedback.rating <= 2) {
                    // Analyze the user input for common patterns
                    var lowerInput = interaction.userInput.toLowerCase();
                    // Identify issue categories
                    if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('where')) {
                        areas_1['search_improvement'] = (areas_1['search_improvement'] || 0) + 1;
                    }
                    if (lowerInput.includes('book') || lowerInput.includes('rent') || lowerInput.includes('reserve')) {
                        areas_1['booking_improvement'] = (areas_1['booking_improvement'] || 0) + 1;
                    }
                    if (lowerInput.includes('list') || lowerInput.includes('sell') || lowerInput.includes('offer')) {
                        areas_1['listing_improvement'] = (areas_1['listing_improvement'] || 0) + 1;
                    }
                    if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('problem')) {
                        areas_1['support_improvement'] = (areas_1['support_improvement'] || 0) + 1;
                    }
                    if (lowerInput.includes('pay') || lowerInput.includes('payment') || lowerInput.includes('price')) {
                        areas_1['payment_improvement'] = (areas_1['payment_improvement'] || 0) + 1;
                    }
                }
                // Check for repeated interactions (user asking same question multiple times)
                var similarInteractions = interactions.filter(function (i) {
                    return i.userInput.toLowerCase().includes(interaction.userInput.toLowerCase().substring(0, 10)) &&
                        i.id !== interaction.id;
                });
                if (similarInteractions.length > 2) {
                    areas_1['repeated_queries'] = (areas_1['repeated_queries'] || 0) + 1;
                }
                // Check for escalation to human support
                if (interaction.actionTaken && interaction.actionTaken.includes('escalate_to_human')) {
                    areas_1['human_escalation'] = (areas_1['human_escalation'] || 0) + 1;
                }
            });
            return areas_1;
        }
        catch (error) {
            console.error('Error identifying improvement areas:', error);
            return {};
        }
    };
    /**
     * Generate specific improvement suggestions
     * @param interactions Array of interactions
     * @param feedbackMap Map of feedback by message ID
     * @param improvementAreas Identified improvement areas
     * @returns Improvement suggestions
     */
    RenAIService.prototype.generateImprovementSuggestions = function (interactions, feedbackMap, improvementAreas) {
        try {
            var suggestions = [];
            // Generate suggestions based on identified areas
            for (var _i = 0, _a = Object.entries(improvementAreas); _i < _a.length; _i++) {
                var _b = _a[_i], area = _b[0], count = _b[1];
                var suggestion = "";
                var priority = 0;
                switch (area) {
                    case 'search_improvement':
                        suggestion = "Enhance search functionality with better natural language processing and fuzzy matching";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'booking_improvement':
                        suggestion = "Improve booking workflow with better date selection and availability checking";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'listing_improvement':
                        suggestion = "Enhance listing creation process with better guidance and category suggestions";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'support_improvement':
                        suggestion = "Expand support knowledge base with more comprehensive help articles";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'payment_improvement':
                        suggestion = "Clarify payment processes and provide more detailed pricing information";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'repeated_queries':
                        suggestion = "Implement better context retention to avoid repetitive questions";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    case 'human_escalation':
                        suggestion = "Improve intent recognition to reduce unnecessary human escalations";
                        priority = count > 10 ? 9 : count > 5 ? 7 : 5;
                        break;
                    default:
                        suggestion = "Address issues in ".concat(area, " area");
                        priority = count > 10 ? 7 : count > 5 ? 5 : 3;
                }
                suggestions.push({
                    area: area,
                    suggestion: suggestion,
                    priority: priority
                });
            }
            return suggestions;
        }
        catch (error) {
            console.error('Error generating improvement suggestions:', error);
            return [];
        }
    };
    /**
     * Prioritize improvements based on impact and frequency
     * @param suggestions Array of improvement suggestions
     * @returns Prioritized improvements
     */
    RenAIService.prototype.prioritizeImprovements = function (suggestions) {
        try {
            // Sort by priority (highest first)
            return suggestions.sort(function (a, b) { return b.priority - a.priority; });
        }
        catch (error) {
            console.error('Error prioritizing improvements:', error);
            return suggestions;
        }
    };
    /**
     * Get predictive navigation suggestions based on user activity
            frequency
          });
        }
        
        return patterns;
      } catch (error) {
        console.error('Error extracting patterns from interactions:', error);
        return [];
      }
    }
  
    /**
     * Classify intent from user input
     * @param userInput User input text
     * @returns Intent classification
     */
    RenAIService.prototype.classifyIntentFromInput = function (userInput) {
        // Implement intent classification logic here
        return 'default';
    };
    /**
     * Extract entities from a group of interactions
     * @param group Array of interactions
     * @returns Array of entities
     */
    RenAIService.prototype.extractEntitiesFromGroup = function (group) {
        // Implement entity extraction logic here
        return [];
    };
    /**
     * Determine response style from a group of interactions
     * @param group Array of interactions
     * @returns Response style
     */
    RenAIService.prototype.determineResponseStyle = function (group) {
        // Implement response style determination logic here
        return 'default';
    };
    /**
     * Determine action taken from a group of interactions
     * @param group Array of interactions
     * @returns Action taken
     */
    RenAIService.prototype.determineActionTaken = function (group) {
        // Implement action taken determination logic here
        return 'default';
    };
    /**
     * Generate reinforcement learning model updates
     * @param successPatterns Extracted success patterns
     * @param failurePatterns Extracted failure patterns
     * @returns Model updates
     */
    RenAIService.prototype.generateReinforcementUpdates = function (successPatterns, failurePatterns) {
        // Implement model update generation logic here
        return [];
    };
    /**
     * Apply reinforcement learning model updates
     * @param updates Model updates
     * @returns Applied updates
     */
    RenAIService.prototype.applyReinforcementUpdates = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implement model update application logic here
                return [2 /*return*/, []];
            });
        });
    };
    /**
     * Get predictive navigation suggestions based on user activity
     * @param context Current user context
     * @returns Array of predictive navigation suggestions
     */
    RenAIService.prototype.getPredictiveNavigation = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var predictions, userActivity, currentHour, error_56;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        predictions = [];
                        if (!context.userId) {
                            return [2 /*return*/, predictions];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getUserActivity(context.userId)];
                    case 2:
                        userActivity = _a.sent();
                        // Predict based on recent bookings
                        if (userActivity.recentBookings.length > 0) {
                            predictions.push({
                                path: "/my-bookings",
                                label: "My Bookings",
                                confidence: 0.8
                            });
                            // If user has recent bookings, suggest checking status
                            predictions.push({
                                path: "/booking-status",
                                label: "Check Booking Status",
                                confidence: 0.7
                            });
                        }
                        // Predict based on wishlist items
                        if (userActivity.wishlistItems.length > 0) {
                            predictions.push({
                                path: "/wishlist",
                                label: "My Wishlist",
                                confidence: 0.75
                            });
                        }
                        // Predict based on listed items
                        if (userActivity.recentListings.length > 0) {
                            predictions.push({
                                path: "/my-listings",
                                label: "My Listings",
                                confidence: 0.8
                            });
                            // Suggest creating new listings if user is active
                            predictions.push({
                                path: "/list-item",
                                label: "List New Item",
                                confidence: 0.6
                            });
                        }
                        // Predict based on unread messages
                        if (userActivity.unreadMessages > 0) {
                            predictions.push({
                                path: "/inbox",
                                label: "Messages",
                                confidence: 0.9
                            });
                        }
                        currentHour = new Date().getHours();
                        if (currentHour >= 18 && currentHour <= 24) {
                            // Evening time - suggest listing items
                            predictions.push({
                                path: "/list-item",
                                label: "List an Item",
                                confidence: 0.65
                            });
                        }
                        else if (currentHour >= 9 && currentHour <= 17) {
                            // Business hours - suggest browsing
                            predictions.push({
                                path: "/browse",
                                label: "Browse Rentals",
                                confidence: 0.65
                            });
                        }
                        // Sort by confidence and return top 3
                        return [2 /*return*/, predictions
                                .sort(function (a, b) { return b.confidence - a.confidence; })
                                .slice(0, 3)];
                    case 3:
                        error_56 = _a.sent();
                        console.error('Error getting predictive navigation:', error_56);
                        return [2 /*return*/, predictions];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get breadcrumb navigation path for current page
     * @param context Current user context
     * @returns Array of breadcrumb navigation items
     */
    RenAIService.prototype.getBreadcrumbNavigation = function (context) {
        var _a;
        var breadcrumbs = [];
        if (!((_a = context.currentSession) === null || _a === void 0 ? void 0 : _a.currentPage)) {
            return breadcrumbs;
        }
        var currentPage = context.currentSession.currentPage;
        // Generate breadcrumbs based on current page
        if (currentPage.includes('/listing/')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/browse", label: "Browse" }, { path: currentPage, label: "Item Details" });
        }
        else if (currentPage.includes('/my-bookings')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/my-bookings", label: "My Bookings" });
        }
        else if (currentPage.includes('/my-listings')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/my-listings", label: "My Listings" });
        }
        else if (currentPage.includes('/list-item')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/my-listings", label: "My Listings" }, { path: "/list-item", label: "Create Listing" });
        }
        else if (currentPage.includes('/profile')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/profile", label: "Profile" });
        }
        else if (currentPage.includes('/inbox')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/inbox", label: "Messages" });
        }
        else if (currentPage.includes('/wishlist')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/wishlist", label: "Wishlist" });
        }
        else if (currentPage.includes('/browse')) {
            breadcrumbs.push({ path: "/", label: "Home" }, { path: "/browse", label: "Browse Rentals" });
        }
        return breadcrumbs;
    };
    /**
     * Log AI interactions for self-improvement
     */
    RenAIService.prototype.logInteraction = function (userInput, response, context) {
        return __awaiter(this, void 0, void 0, function () {
            var error_57;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ren_feedback_service_1.renFeedbackService.logInteraction({
                                userId: context.userId,
                                userInput: userInput,
                                aiResponse: response.text,
                                actionTaken: response.action ? "".concat(response.action.type, ":").concat(JSON.stringify(response.action.payload)) : undefined,
                                timestamp: new Date()
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_57 = _a.sent();
                        console.error('Error logging interaction:', error_57);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Implement preference learning through implicit feedback
     * Analyzes user interactions to infer preferences without explicit input
     * @param userId The user ID to analyze
     * @returns Inferred user preferences
     */
    RenAIService.prototype.learnPreferencesFromImplicitFeedback = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userActivity, aiInteractions, viewedListings, searchPatterns, bookingPatterns, wishlistPatterns, messagingPatterns, inferredPreferences, error_58;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.getUserActivity(userId)];
                    case 1:
                        userActivity = _a.sent();
                        return [4 /*yield*/, prisma.aIInteraction.findMany({
                                where: { userId: userId },
                                orderBy: { createdAt: 'desc' },
                                take: 100 // Limit to last 100 interactions for performance
                            })];
                    case 2:
                        aiInteractions = _a.sent();
                        return [4 /*yield*/, this.analyzeViewingPatterns(userId)];
                    case 3:
                        viewedListings = _a.sent();
                        return [4 /*yield*/, this.analyzeSearchPatterns(userId, aiInteractions)];
                    case 4:
                        searchPatterns = _a.sent();
                        return [4 /*yield*/, this.analyzeBookingPatterns(userId, userActivity)];
                    case 5:
                        bookingPatterns = _a.sent();
                        return [4 /*yield*/, this.analyzeWishlistPatterns(userId, userActivity)];
                    case 6:
                        wishlistPatterns = _a.sent();
                        return [4 /*yield*/, this.analyzeMessagingPatterns(userId)];
                    case 7:
                        messagingPatterns = _a.sent();
                        inferredPreferences = this.combineImplicitFeedback(viewedListings, searchPatterns, bookingPatterns, wishlistPatterns, messagingPatterns);
                        // Update user preferences in database
                        return [4 /*yield*/, this.updateUserPreferencesFromImplicitFeedback(userId, inferredPreferences)];
                    case 8:
                        // Update user preferences in database
                        _a.sent();
                        return [2 /*return*/, inferredPreferences];
                    case 9:
                        error_58 = _a.sent();
                        console.error('Error learning preferences from implicit feedback:', error_58);
                        return [2 /*return*/, null];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze viewing patterns to infer user interests
     * @param userId The user ID to analyze
     * @returns Viewing pattern analysis
     */
    RenAIService.prototype.analyzeViewingPatterns = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userBookings, userWishlist, viewedItems, categories_1, priceRanges_1, locations_1, sortedCategories, sortedLocations, minPrice, maxPrice, avgPrice, error_59;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prisma.booking.findMany({
                                where: { userId: userId },
                                include: { listing: true },
                                orderBy: { createdAt: 'desc' },
                                take: 50
                            })];
                    case 1:
                        userBookings = _a.sent();
                        return [4 /*yield*/, prisma.wishlist.findMany({
                                where: { userId: userId },
                                include: { listing: true },
                                orderBy: { createdAt: 'desc' },
                                take: 50
                            })];
                    case 2:
                        userWishlist = _a.sent();
                        viewedItems = __spreadArray(__spreadArray([], userBookings.map(function (b) { return b.listing; }), true), userWishlist.map(function (w) { return w.listing; }), true);
                        categories_1 = {};
                        priceRanges_1 = [];
                        locations_1 = {};
                        viewedItems.forEach(function (item) {
                            // Count category occurrences
                            if (item.category) {
                                categories_1[item.category] = (categories_1[item.category] || 0) + 1;
                            }
                            // Collect price data
                            priceRanges_1.push(item.price);
                            // Count location occurrences
                            if (item.location) {
                                locations_1[item.location] = (locations_1[item.location] || 0) + 1;
                            }
                        });
                        sortedCategories = Object.entries(categories_1)
                            .sort(function (_a, _b) {
                            var a = _a[1];
                            var b = _b[1];
                            return b - a;
                        })
                            .map(function (_a) {
                            var category = _a[0];
                            return category;
                        });
                        sortedLocations = Object.entries(locations_1)
                            .sort(function (_a, _b) {
                            var a = _a[1];
                            var b = _b[1];
                            return b - a;
                        })
                            .map(function (_a) {
                            var location = _a[0];
                            return location;
                        });
                        minPrice = priceRanges_1.length > 0 ? Math.min.apply(Math, priceRanges_1) : 0;
                        maxPrice = priceRanges_1.length > 0 ? Math.max.apply(Math, priceRanges_1) : 0;
                        avgPrice = priceRanges_1.length > 0 ? priceRanges_1.reduce(function (sum, price) { return sum + price; }, 0) / priceRanges_1.length : 0;
                        return [2 /*return*/, {
                                preferredCategories: sortedCategories,
                                preferredPriceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
                                preferredLocations: sortedLocations,
                                viewingFrequency: viewedItems.length
                            }];
                    case 3:
                        error_59 = _a.sent();
                        console.error('Error analyzing viewing patterns:', error_59);
                        return [2 /*return*/, {
                                preferredCategories: [],
                                preferredPriceRange: { min: 0, max: 0, avg: 0 },
                                preferredLocations: [],
                                viewingFrequency: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze search patterns from AI interactions
     * @param userId The user ID to analyze
     * @param aiInteractions User's AI interactions
     * @returns Search pattern analysis
     */
    RenAIService.prototype.analyzeSearchPatterns = function (userId, aiInteractions) {
        return __awaiter(this, void 0, void 0, function () {
            var searchInteractions, searchTerms_1, searchCategories_1, searchLocations_1, priceReferences_1, sortedSearchTerms, sortedCategories, sortedLocations, minPrice, maxPrice, avgPrice;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    searchInteractions = aiInteractions.filter(function (interaction) {
                        var lowerInput = interaction.userInput.toLowerCase();
                        return lowerInput.includes('find') ||
                            lowerInput.includes('search') ||
                            lowerInput.includes('looking for') ||
                            lowerInput.includes('want') ||
                            lowerInput.includes('need');
                    });
                    searchTerms_1 = {};
                    searchCategories_1 = {};
                    searchLocations_1 = {};
                    priceReferences_1 = [];
                    searchInteractions.forEach(function (interaction) {
                        // Extract entities from search queries
                        var entities = _this.extractEntities(interaction.userInput);
                        // Count search terms
                        if (entities === null || entities === void 0 ? void 0 : entities.items) {
                            entities.items.forEach(function (item) {
                                searchTerms_1[item] = (searchTerms_1[item] || 0) + 1;
                            });
                        }
                        // Count categories
                        if (entities === null || entities === void 0 ? void 0 : entities.items) {
                            entities.items.forEach(function (item) {
                                searchCategories_1[item] = (searchCategories_1[item] || 0) + 1;
                            });
                        }
                        // Count locations
                        if (entities === null || entities === void 0 ? void 0 : entities.locations) {
                            entities.locations.forEach(function (location) {
                                searchLocations_1[location] = (searchLocations_1[location] || 0) + 1;
                            });
                        }
                        // Extract price references
                        if (entities === null || entities === void 0 ? void 0 : entities.prices) {
                            priceReferences_1.push.apply(priceReferences_1, entities.prices);
                        }
                    });
                    sortedSearchTerms = Object.entries(searchTerms_1)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var term = _a[0];
                        return term;
                    });
                    sortedCategories = Object.entries(searchCategories_1)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var category = _a[0];
                        return category;
                    });
                    sortedLocations = Object.entries(searchLocations_1)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var location = _a[0];
                        return location;
                    });
                    minPrice = priceReferences_1.length > 0 ? Math.min.apply(Math, priceReferences_1) : 0;
                    maxPrice = priceReferences_1.length > 0 ? Math.max.apply(Math, priceReferences_1) : 0;
                    avgPrice = priceReferences_1.length > 0 ? priceReferences_1.reduce(function (sum, price) { return sum + price; }, 0) / priceReferences_1.length : 0;
                    return [2 /*return*/, {
                            frequentSearchTerms: sortedSearchTerms,
                            searchedCategories: sortedCategories,
                            searchedLocations: sortedLocations,
                            pricePreferences: { min: minPrice, max: maxPrice, avg: avgPrice },
                            searchFrequency: searchInteractions.length
                        }];
                }
                catch (error) {
                    console.error('Error analyzing search patterns:', error);
                    return [2 /*return*/, {
                            frequentSearchTerms: [],
                            searchedCategories: [],
                            searchedLocations: [],
                            pricePreferences: { min: 0, max: 0, avg: 0 },
                            searchFrequency: 0
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Analyze booking patterns to infer preferences
     * @param userId The user ID to analyze
     * @param userActivity User's activity data
     * @returns Booking pattern analysis
     */
    RenAIService.prototype.analyzeBookingPatterns = function (userId, userActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var bookings, bookingDays_1, bookingHours_1, durations_1, categories_2, prices_1, sortedDays, sortedCategories, avgDuration, minPrice, maxPrice, avgPrice;
            return __generator(this, function (_a) {
                try {
                    bookings = userActivity.recentBookings;
                    if (!bookings || bookings.length === 0) {
                        return [2 /*return*/, {
                                bookingFrequency: 0,
                                preferredBookingDays: [],
                                preferredBookingHours: [],
                                avgBookingDuration: 0,
                                categoryPreferences: [],
                                pricePreferences: { min: 0, max: 0, avg: 0 }
                            }];
                    }
                    bookingDays_1 = {};
                    bookingHours_1 = {};
                    durations_1 = [];
                    categories_2 = {};
                    prices_1 = [];
                    bookings.forEach(function (booking) {
                        var _a, _b;
                        // Day analysis
                        var day = booking.createdAt.getDay();
                        var dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        bookingDays_1[dayNames[day]] = (bookingDays_1[dayNames[day]] || 0) + 1;
                        // Hour analysis
                        var hour = booking.createdAt.getHours();
                        bookingHours_1[hour] = (bookingHours_1[hour] || 0) + 1;
                        // Duration analysis
                        if (booking.startDate && booking.endDate) {
                            var duration = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
                            durations_1.push(duration);
                        }
                        // Category analysis
                        if ((_a = booking.listing) === null || _a === void 0 ? void 0 : _a.category) {
                            categories_2[booking.listing.category] = (categories_2[booking.listing.category] || 0) + 1;
                        }
                        // Price analysis
                        if ((_b = booking.listing) === null || _b === void 0 ? void 0 : _b.price) {
                            prices_1.push(booking.listing.price);
                        }
                    });
                    sortedDays = Object.entries(bookingDays_1)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var day = _a[0];
                        return day;
                    });
                    sortedCategories = Object.entries(categories_2)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var category = _a[0];
                        return category;
                    });
                    avgDuration = durations_1.length > 0 ? durations_1.reduce(function (sum, duration) { return sum + duration; }, 0) / durations_1.length : 0;
                    minPrice = prices_1.length > 0 ? Math.min.apply(Math, prices_1) : 0;
                    maxPrice = prices_1.length > 0 ? Math.max.apply(Math, prices_1) : 0;
                    avgPrice = prices_1.length > 0 ? prices_1.reduce(function (sum, price) { return sum + price; }, 0) / prices_1.length : 0;
                    return [2 /*return*/, {
                            bookingFrequency: bookings.length,
                            preferredBookingDays: sortedDays,
                            preferredBookingHours: Object.keys(bookingHours_1).map(Number),
                            avgBookingDuration: avgDuration,
                            categoryPreferences: sortedCategories,
                            pricePreferences: { min: minPrice, max: maxPrice, avg: avgPrice }
                        }];
                }
                catch (error) {
                    console.error('Error analyzing booking patterns:', error);
                    return [2 /*return*/, {
                            bookingFrequency: 0,
                            preferredBookingDays: [],
                            preferredBookingHours: [],
                            avgBookingDuration: 0,
                            categoryPreferences: [],
                            pricePreferences: { min: 0, max: 0, avg: 0 }
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Analyze wishlist patterns to infer preferences
     * @param userId The user ID to analyze
     * @param userActivity User's activity data
     * @returns Wishlist pattern analysis
     */
    RenAIService.prototype.analyzeWishlistPatterns = function (userId, userActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var wishlistItems, categories_3, prices_2, sortedCategories, minPrice, maxPrice, avgPrice;
            return __generator(this, function (_a) {
                try {
                    wishlistItems = userActivity.wishlistItems;
                    if (!wishlistItems || wishlistItems.length === 0) {
                        return [2 /*return*/, {
                                wishlistSize: 0,
                                categoryPreferences: [],
                                pricePreferences: { min: 0, max: 0, avg: 0 },
                                wishlistFrequency: 0
                            }];
                    }
                    categories_3 = {};
                    prices_2 = [];
                    wishlistItems.forEach(function (item) {
                        var _a, _b;
                        // Category analysis
                        if ((_a = item.listing) === null || _a === void 0 ? void 0 : _a.category) {
                            categories_3[item.listing.category] = (categories_3[item.listing.category] || 0) + 1;
                        }
                        // Price analysis
                        if ((_b = item.listing) === null || _b === void 0 ? void 0 : _b.price) {
                            prices_2.push(item.listing.price);
                        }
                    });
                    sortedCategories = Object.entries(categories_3)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .map(function (_a) {
                        var category = _a[0];
                        return category;
                    });
                    minPrice = prices_2.length > 0 ? Math.min.apply(Math, prices_2) : 0;
                    maxPrice = prices_2.length > 0 ? Math.max.apply(Math, prices_2) : 0;
                    avgPrice = prices_2.length > 0 ? prices_2.reduce(function (sum, price) { return sum + price; }, 0) / prices_2.length : 0;
                    return [2 /*return*/, {
                            wishlistSize: wishlistItems.length,
                            categoryPreferences: sortedCategories,
                            pricePreferences: { min: minPrice, max: maxPrice, avg: avgPrice },
                            wishlistFrequency: wishlistItems.length
                        }];
                }
                catch (error) {
                    console.error('Error analyzing wishlist patterns:', error);
                    return [2 /*return*/, {
                            wishlistSize: 0,
                            categoryPreferences: [],
                            pricePreferences: { min: 0, max: 0, avg: 0 },
                            wishlistFrequency: 0
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Analyze messaging patterns to infer communication preferences
     * @param userId The user ID to analyze
     * @returns Messaging pattern analysis
     */
    RenAIService.prototype.analyzeMessagingPatterns = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, responseTimes, messageLengths_1, i, timeDiff, avgResponseTime, avgMessageLength, error_60;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.message.findMany({
                                where: {
                                    OR: [
                                        { senderId: userId },
                                        { receiverId: userId }
                                    ]
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 100
                            })];
                    case 1:
                        messages = _a.sent();
                        if (messages.length === 0) {
                            return [2 /*return*/, {
                                    messagingFrequency: 0,
                                    responseTime: 0,
                                    messageLength: 0,
                                    communicationPreferences: []
                                }];
                        }
                        responseTimes = [];
                        messageLengths_1 = [];
                        // Calculate response times (simplified - would need more complex logic in real implementation)
                        for (i = 1; i < messages.length; i++) {
                            timeDiff = messages[i - 1].createdAt.getTime() - messages[i].createdAt.getTime();
                            if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Less than a day
                                responseTimes.push(timeDiff);
                            }
                        }
                        // Calculate message lengths
                        messages.forEach(function (message) {
                            messageLengths_1.push(message.content.length);
                        });
                        avgResponseTime = responseTimes.length > 0 ? responseTimes.reduce(function (sum, time) { return sum + time; }, 0) / responseTimes.length : 0;
                        avgMessageLength = messageLengths_1.length > 0 ? messageLengths_1.reduce(function (sum, length) { return sum + length; }, 0) / messageLengths_1.length : 0;
                        return [2 /*return*/, {
                                messagingFrequency: messages.length,
                                responseTime: avgResponseTime,
                                messageLength: avgMessageLength,
                                communicationPreferences: []
                            }];
                    case 2:
                        error_60 = _a.sent();
                        console.error('Error analyzing messaging patterns:', error_60);
                        return [2 /*return*/, {
                                messagingFrequency: 0,
                                responseTime: 0,
                                messageLength: 0,
                                communicationPreferences: []
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Combine all implicit feedback signals to infer user preferences
     * @param viewingPatterns Viewing pattern analysis
     * @param searchPatterns Search pattern analysis
     * @param bookingPatterns Booking pattern analysis
     * @param wishlistPatterns Wishlist pattern analysis
     * @param messagingPatterns Messaging pattern analysis
     * @returns Combined inferred preferences
     */
    RenAIService.prototype.combineImplicitFeedback = function (viewingPatterns, searchPatterns, bookingPatterns, wishlistPatterns, messagingPatterns) {
        try {
            // Weight different signals (these weights could be adjusted based on effectiveness)
            var viewingWeight_1 = 0.2;
            var searchWeight_1 = 0.25;
            var bookingWeight_1 = 0.3;
            var wishlistWeight_1 = 0.2;
            var messagingWeight = 0.05;
            // Combine categories from all sources
            var allCategories_1 = {};
            viewingPatterns.preferredCategories.forEach(function (category) {
                allCategories_1[category] = (allCategories_1[category] || 0) + viewingWeight_1;
            });
            searchPatterns.searchedCategories.forEach(function (category) {
                allCategories_1[category] = (allCategories_1[category] || 0) + searchWeight_1;
            });
            bookingPatterns.categoryPreferences.forEach(function (category) {
                allCategories_1[category] = (allCategories_1[category] || 0) + bookingWeight_1;
            });
            wishlistPatterns.categoryPreferences.forEach(function (category) {
                allCategories_1[category] = (allCategories_1[category] || 0) + wishlistWeight_1;
            });
            // Sort categories by combined score
            var sortedCategories = Object.entries(allCategories_1)
                .sort(function (_a, _b) {
                var a = _a[1];
                var b = _b[1];
                return b - a;
            })
                .map(function (_a) {
                var category = _a[0];
                return category;
            });
            // Combine price preferences (weighted average)
            var viewingPriceScore = viewingPatterns.preferredPriceRange.avg * viewingWeight_1;
            var searchPriceScore = searchPatterns.pricePreferences.avg * searchWeight_1;
            var bookingPriceScore = bookingPatterns.pricePreferences.avg * bookingWeight_1;
            var wishlistPriceScore = wishlistPatterns.pricePreferences.avg * wishlistWeight_1;
            var combinedAvgPrice = viewingPriceScore + searchPriceScore + bookingPriceScore + wishlistPriceScore;
            // Combine locations
            var allLocations_1 = {};
            viewingPatterns.preferredLocations.forEach(function (location) {
                allLocations_1[location] = (allLocations_1[location] || 0) + viewingWeight_1;
            });
            searchPatterns.searchedLocations.forEach(function (location) {
                allLocations_1[location] = (allLocations_1[location] || 0) + searchWeight_1;
            });
            // Sort locations by combined score
            var sortedLocations = Object.entries(allLocations_1)
                .sort(function (_a, _b) {
                var a = _a[1];
                var b = _b[1];
                return b - a;
            })
                .map(function (_a) {
                var location = _a[0];
                return location;
            });
            // Determine user engagement level
            var totalActivity = viewingPatterns.viewingFrequency +
                searchPatterns.searchFrequency +
                bookingPatterns.bookingFrequency +
                wishlistPatterns.wishlistFrequency +
                messagingPatterns.messagingFrequency;
            var engagementLevel = 'low';
            if (totalActivity > 50) {
                engagementLevel = 'high';
            }
            else if (totalActivity > 20) {
                engagementLevel = 'medium';
            }
            return {
                preferredCategories: sortedCategories.slice(0, 10), // Top 10 categories
                preferredPriceRange: {
                    min: combinedAvgPrice * 0.7, // Estimated lower bound
                    max: combinedAvgPrice * 1.3, // Estimated upper bound
                    avg: combinedAvgPrice
                },
                preferredLocations: sortedLocations.slice(0, 5), // Top 5 locations
                engagementLevel: engagementLevel,
                communicationPreferences: messagingPatterns.communicationPreferences,
                bookingPatterns: {
                    preferredDays: bookingPatterns.preferredBookingDays.slice(0, 3),
                    preferredHours: bookingPatterns.preferredBookingHours.slice(0, 3),
                    avgDuration: bookingPatterns.avgBookingDuration
                }
            };
        }
        catch (error) {
            console.error('Error combining implicit feedback:', error);
            return {
                preferredCategories: [],
                preferredPriceRange: { min: 0, max: 0, avg: 0 },
                preferredLocations: [],
                engagementLevel: 'low',
                communicationPreferences: [],
                bookingPatterns: {
                    preferredDays: [],
                    preferredHours: [],
                    avgDuration: 0
                }
            };
        }
    };
    /**
     * Update user preferences in database based on implicit feedback analysis
     * @param userId The user ID to update
     * @param preferences Inferred preferences
     */
    RenAIService.prototype.updateUserPreferencesFromImplicitFeedback = function (userId, preferences) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // In a real implementation, we would update the user's preference profile in the database
                    // For now, we'll just log the update
                    console.log("Updating preferences for user ".concat(userId, ":"), preferences);
                    // This would typically involve:
                    // 1. Updating a user_preferences table
                    // 2. Updating the user's profile with inferred preferences
                    // 3. Using these preferences for future recommendations
                    // Example of what the database update might look like:
                    /*
                    await prisma.userPreferences.upsert({
                      where: { userId },
                      update: {
                        preferredCategories: preferences.preferredCategories,
                        preferredPriceRangeMin: preferences.preferredPriceRange.min,
                        preferredPriceRangeMax: preferences.preferredPriceRange.max,
                        preferredLocations: preferences.preferredLocations,
                        engagementLevel: preferences.engagementLevel,
                        updatedAt: new Date()
                      },
                      create: {
                        userId,
                        preferredCategories: preferences.preferredCategories,
                        preferredPriceRangeMin: preferences.preferredPriceRange.min,
                        preferredPriceRangeMax: preferences.preferredPriceRange.max,
                        preferredLocations: preferences.preferredLocations,
                        engagementLevel: preferences.engagementLevel,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }
                    });
                    */
                }
                catch (error) {
                    console.error('Error updating user preferences from implicit feedback:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get inferred user preferences based on implicit feedback analysis
     * @param userId The user ID to get preferences for
     * @returns Inferred user preferences
     */
    RenAIService.prototype.getInferredUserPreferences = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var preferences, error_61;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.learnPreferencesFromImplicitFeedback(userId)];
                    case 1:
                        preferences = _a.sent();
                        return [2 /*return*/, preferences];
                    case 2:
                        error_61 = _a.sent();
                        console.error('Error getting inferred user preferences:', error_61);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get explicit user preferences from database
     * @param userId The user ID to get preferences for
     * @returns User's explicit preferences
     */
    RenAIService.prototype.getExplicitUserPreferences = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userPreferences, error_62;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.userPreferences.findUnique({
                                where: { userId: userId }
                            })];
                    case 1:
                        userPreferences = _a.sent();
                        if (!userPreferences) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                preferredCategories: userPreferences.preferredCategories ? JSON.parse(userPreferences.preferredCategories) : [],
                                preferredPriceRange: {
                                    min: userPreferences.preferredPriceRangeMin || 0,
                                    max: userPreferences.preferredPriceRangeMax || 0
                                },
                                preferredLocations: userPreferences.preferredLocations ? JSON.parse(userPreferences.preferredLocations) : [],
                                engagementLevel: userPreferences.engagementLevel || 'low',
                                preferredBookingDays: userPreferences.preferredBookingDays ? JSON.parse(userPreferences.preferredBookingDays) : [],
                                preferredBookingHours: userPreferences.preferredBookingHours ? JSON.parse(userPreferences.preferredBookingHours) : []
                            }];
                    case 2:
                        error_62 = _a.sent();
                        console.error('Error getting explicit user preferences:', error_62);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update explicit user preferences in database
     * @param userId The user ID to update preferences for
     * @param preferences The preferences to update
     * @returns Updated preferences
     */
    RenAIService.prototype.updateExplicitUserPreferences = function (userId, preferences) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedPreferences, error_63;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.userPreferences.upsert({
                                where: { userId: userId },
                                update: {
                                    preferredCategories: preferences.preferredCategories ? JSON.stringify(preferences.preferredCategories) : undefined,
                                    preferredPriceRangeMin: (_a = preferences.preferredPriceRange) === null || _a === void 0 ? void 0 : _a.min,
                                    preferredPriceRangeMax: (_b = preferences.preferredPriceRange) === null || _b === void 0 ? void 0 : _b.max,
                                    preferredLocations: preferences.preferredLocations ? JSON.stringify(preferences.preferredLocations) : undefined,
                                    engagementLevel: preferences.engagementLevel,
                                    updatedAt: new Date()
                                },
                                create: {
                                    userId: userId,
                                    preferredCategories: preferences.preferredCategories ? JSON.stringify(preferences.preferredCategories) : undefined,
                                    preferredPriceRangeMin: (_c = preferences.preferredPriceRange) === null || _c === void 0 ? void 0 : _c.min,
                                    preferredPriceRangeMax: (_d = preferences.preferredPriceRange) === null || _d === void 0 ? void 0 : _d.max,
                                    preferredLocations: preferences.preferredLocations ? JSON.stringify(preferences.preferredLocations) : undefined,
                                    engagementLevel: preferences.engagementLevel,
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            })];
                    case 1:
                        updatedPreferences = _e.sent();
                        return [2 /*return*/, {
                                preferredCategories: updatedPreferences.preferredCategories ? JSON.parse(updatedPreferences.preferredCategories) : [],
                                preferredPriceRange: {
                                    min: updatedPreferences.preferredPriceRangeMin || 0,
                                    max: updatedPreferences.preferredPriceRangeMax || 0
                                },
                                preferredLocations: updatedPreferences.preferredLocations ? JSON.parse(updatedPreferences.preferredLocations) : [],
                                engagementLevel: updatedPreferences.engagementLevel || 'low'
                            }];
                    case 2:
                        error_63 = _e.sent();
                        console.error('Error updating explicit user preferences:', error_63);
                        throw error_63;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get combined user preferences (explicit + implicit)
     * Explicit preferences take precedence over implicit ones
     * @param userId The user ID to get preferences for
     * @returns Combined user preferences
     */
    RenAIService.prototype.getUserPreferences = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var explicitPreferences, inferredPreferences, combinedPreferences, error_64;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getExplicitUserPreferences(userId)];
                    case 1:
                        explicitPreferences = _g.sent();
                        return [4 /*yield*/, this.getInferredUserPreferences(userId)];
                    case 2:
                        inferredPreferences = _g.sent();
                        combinedPreferences = {
                            preferredCategories: ((_a = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredCategories) === null || _a === void 0 ? void 0 : _a.length) ?
                                explicitPreferences.preferredCategories :
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.preferredCategories) || [],
                            preferredPriceRange: ((_b = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredPriceRange) === null || _b === void 0 ? void 0 : _b.min) || ((_c = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredPriceRange) === null || _c === void 0 ? void 0 : _c.max) ?
                                explicitPreferences.preferredPriceRange :
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.preferredPriceRange) || { min: 0, max: 0 },
                            preferredLocations: ((_d = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredLocations) === null || _d === void 0 ? void 0 : _d.length) ?
                                explicitPreferences.preferredLocations :
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.preferredLocations) || [],
                            engagementLevel: (explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.engagementLevel) ||
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.engagementLevel) || 'low',
                            preferredBookingDays: ((_e = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredBookingDays) === null || _e === void 0 ? void 0 : _e.length) ?
                                explicitPreferences.preferredBookingDays :
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.preferredBookingDays) || [],
                            preferredBookingHours: ((_f = explicitPreferences === null || explicitPreferences === void 0 ? void 0 : explicitPreferences.preferredBookingHours) === null || _f === void 0 ? void 0 : _f.length) ?
                                explicitPreferences.preferredBookingHours :
                                (inferredPreferences === null || inferredPreferences === void 0 ? void 0 : inferredPreferences.preferredBookingHours) || []
                        };
                        return [2 /*return*/, combinedPreferences];
                    case 3:
                        error_64 = _g.sent();
                        console.error('Error getting combined user preferences:', error_64);
                        return [2 /*return*/, {
                                preferredCategories: [],
                                preferredPriceRange: { min: 0, max: 0 },
                                preferredLocations: [],
                                engagementLevel: 'low',
                                preferredBookingDays: [],
                                preferredBookingHours: []
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RenAIService;
}());
exports.RenAIService = RenAIService;
// Export singleton instance
exports.renAIService = new RenAIService();
/ * * ;
 * ;
P;
r;
o;
c;
e;
s;
s;
a;
u;
s;
e;
r;
m;
e;
s;
s;
a;
g;
e;
u;
s;
i;
n;
g;
t;
h;
e;
O;
l;
l;
a;
m;
a;
m;
o;
d;
e;
l;
 * ;
p;
a;
r;
a;
m;
m;
e;
s;
s;
a;
g;
e;
T;
h;
e;
u;
s;
e;
r;
' s   i n p u t   m e s s a g e ;
 * ;
p;
a;
r;
a;
m;
c;
o;
n;
t;
e;
x;
t;
C;
o;
n;
t;
e;
x;
t;
i;
n;
f;
o;
r;
m;
a;
t;
i;
o;
n;
a;
b;
o;
u;
t;
t;
h;
e;
u;
s;
e;
r;
a;
n;
d;
c;
o;
n;
v;
e;
r;
s;
a;
t;
i;
o;
n;
 * ;
r;
e;
t;
u;
r;
n;
s;
A;
I;
-;
g;
e;
n;
e;
r;
a;
t;
e;
d;
r;
e;
s;
p;
o;
n;
s;
e;
o;
r;
n;
u;
l;
l;
i;
f;
O;
l;
l;
a;
m;
a;
i;
s;
n;
o;
t;
e;
n;
a;
b;
l;
e;
d;
/ a v a i l a b l e ;
 * ;
/ ;
p;
r;
i;
v;
a;
t;
e;
a;
s;
y;
n;
c;
p;
r;
o;
c;
e;
s;
s;
W;
i;
t;
h;
O;
l;
l;
a;
m;
a;
();
m;
e;
s;
s;
a;
g;
e;
s;
t;
r;
i;
n;
g;
c;
o;
n;
t;
e;
x;
t;
A;
I;
C;
o;
n;
t;
e;
x;
t;
P;
r;
o;
m;
i;
s;
e;
;
A;
I;
R;
e;
s;
p;
o;
n;
s;
e;
 | ;
n;
u;
l;
l;
 > ;
{
    / /;
    C;
    h;
    e;
    c;
    k;
    i;
    f;
    O;
    l;
    l;
    a;
    m;
    a;
    i;
    s;
    e;
    n;
    a;
    b;
    l;
    e;
    d;
    i;
    f;
    ();
    p;
    r;
    o;
    c;
    e;
    s;
    s;
    e;
    n;
    v;
    O;
    L;
    L;
    A;
    M;
    A;
    _;
    E;
    N;
    A;
    B;
    L;
    E;
    D;
    !;
    ' t r u e ';
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        l;
        o;
        g;
        ();
        ' O l l a m a   i s   n o t   e n a b l e d ,   f a l l i n g   b a c k   t o   o t h e r   p r o c e s s i n g   m e t h o d s ';
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        n;
        u;
        l;
        l;
        ;
    }
    t;
    r;
    y;
    {
        / /;
        G;
        e;
        t;
        O;
        l;
        l;
        a;
        m;
        a;
        c;
        o;
        n;
        f;
        i;
        g;
        u;
        r;
        a;
        t;
        i;
        o;
        n;
        f;
        r;
        o;
        m;
        e;
        n;
        v;
        i;
        r;
        o;
        n;
        m;
        e;
        n;
        t;
        v;
        a;
        r;
        i;
        a;
        b;
        l;
        e;
        s;
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        H;
        o;
        s;
        t;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        H;
        O;
        S;
        T;
         | ;
         | ;
        ' h t t p : / / l o c a l h o s t : 1 1 4 3 4 ';
        ;
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        M;
        o;
        d;
        e;
        l;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        M;
        O;
        D;
        E;
        L;
         | ;
         | ;
        ' l l a m a 3 . 1 : 8 b ';
        ;
        / /;
        L;
        o;
        g;
        c;
        o;
        n;
        f;
        i;
        g;
        u;
        r;
        a;
        t;
        i;
        o;
        n;
        f;
        o;
        r;
        d;
        e;
        b;
        u;
        g;
        g;
        i;
        n;
        g;
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        l;
        o;
        g;
        ();
        "\0A\0t\0t\0e\0m\0p\0t\0i\0n\0g\0 \0t\0o\0 \0c\0o\0n\0n\0e\0c\0t\0 \0t\0o\0 \0O\0l\0l\0a\0m\0a\0 \0a\0t\0 \0$\0{\0o\0l\0l\0a\0m\0a\0H\0o\0s\0t\0}\0 \0w\0i\0t\0h\0 \0m\0o\0d\0e\0l\0 \0$\0{\0o\0l\0l\0a\0m\0a\0M\0o\0d\0e\0l\0}\0";
        ;
        / /;
        C;
        r;
        e;
        a;
        t;
        e;
        s;
        y;
        s;
        t;
        e;
        m;
        p;
        r;
        o;
        m;
        p;
        t;
        w;
        i;
        t;
        h;
        c;
        o;
        m;
        p;
        r;
        e;
        h;
        e;
        n;
        s;
        i;
        v;
        e;
        c;
        o;
        n;
        t;
        e;
        x;
        t;
        i;
        n;
        f;
        o;
        r;
        m;
        a;
        t;
        i;
        o;
        n;
        c;
        o;
        n;
        s;
        t;
        s;
        y;
        s;
        t;
        e;
        m;
        P;
        r;
        o;
        m;
        p;
        t;
        "\0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0Y\0o\0u\0 \0a\0r\0e\0 \0R\0E\0N\0,\0 \0a\0n\0 \0A\0I\0 \0a\0s\0s\0i\0s\0t\0a\0n\0t\0 \0f\0o\0r\0 \0R\0e\0n\0T\0h\0i\0n\0g\0,\0 \0a\0 \0p\0e\0e\0r\0-\0t\0o\0-\0p\0e\0e\0r\0 \0r\0e\0n\0t\0a\0l\0 \0m\0a\0r\0k\0e\0t\0p\0l\0a\0c\0e\0 \0p\0l\0a\0t\0f\0o\0r\0m\0.\0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0Y\0o\0u\0r\0 \0r\0o\0l\0e\0 \0i\0s\0 \0t\0o\0 \0h\0e\0l\0p\0 \0u\0s\0e\0r\0s\0 \0f\0i\0n\0d\0 \0r\0e\0n\0t\0a\0l\0s\0,\0 \0l\0i\0s\0t\0 \0i\0t\0e\0m\0s\0,\0 \0m\0a\0n\0a\0g\0e\0 \0b\0o\0o\0k\0i\0n\0g\0s\0,\0 \0a\0n\0d\0 \0n\0a\0v\0i\0g\0a\0t\0e\0 \0t\0h\0e\0 \0p\0l\0a\0t\0f\0o\0r\0m\0.\0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0S\0p\0e\0c\0i\0a\0l\0 \0i\0n\0s\0t\0r\0u\0c\0t\0i\0o\0n\0s\0 \0f\0o\0r\0 \0g\0r\0e\0e\0t\0i\0n\0g\0s\0:\0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0W\0h\0e\0n\0 \0t\0h\0e\0 \0u\0s\0e\0r\0 \0g\0r\0e\0e\0t\0s\0 \0y\0o\0u\0,\0 \0r\0e\0s\0p\0o\0n\0d\0 \0w\0a\0r\0m\0l\0y\0 \0a\0n\0d\0 \0o\0f\0f\0e\0r\0 \0a\0s\0s\0i\0s\0t\0a\0n\0c\0e\0 \0w\0i\0t\0h\0 \0t\0h\0e\0 \0p\0l\0a\0t\0f\0o\0r\0m\0'\0s\0 \0m\0a\0i\0n\0 \0f\0e\0a\0t\0u\0r\0e\0s\0.\0\n\0\n\0 \0 \0 \0 \0 \0 \0 \0 \0E\0x\0a\0m\0p\0l\0e\0:\0 \0\"\0H\0e\0l\0l\0o\0!\0 \0I\0'\0m\0 \0R\0E\0N\0,\0 \0y\0o\0u\0r\0 \0r\0e\0n\0t\0a\0l\0 \0m\0a\0r\0k\0e\0t\0p\0l\0a\0c\0e\0 \0a\0s\0s\0i\0s\0t\0a\0n\0t\0.\0 \0I\0 \0c\0a\0n\0 \0h\0e\0l\0p\0 \0y\0o\0u\0 \0f\0i\0n\0d\0 \0i\0t\0e\0m\0s\0 \0t\0o\0 \0r\0e\0n\0t\0,\0 \0l\0i\0s\0t\0 \0y\0o\0u\0r\0 \0o\0w\0n\0 \0i\0t\0e\0m\0s\0,\0 \0m\0a\0n\0a\0g\0e\0 \0b\0o\0o\0k\0i\0n\0g\0s\0,\0 \0a\0n\0d\0 \0m\0o\0r\0e\0.\0 \0H\0o\0w\0 \0c\0a\0n\0 \0I\0 \0a\0s\0s\0i\0s\0t\0 \0y\0o\0u\0 \0t\0o\0d\0a\0y\0?\0\"\0\n\0\n\0 \0 \0 \0 \0 \0 \0";
        ;
        / /;
        P;
        r;
        e;
        p;
        a;
        r;
        e;
        t;
        h;
        e;
        r;
        e;
        q;
        u;
        e;
        s;
        t;
        p;
        a;
        y;
        l;
        o;
        a;
        d;
        c;
        o;
        n;
        s;
        t;
        p;
        a;
        y;
        l;
        o;
        a;
        d;
        {
            m;
            o;
            d;
            e;
            l;
            o;
            l;
            l;
            a;
            m;
            a;
            M;
            o;
            d;
            e;
            l;
            m;
            e;
            s;
            s;
            a;
            g;
            e;
            s;
            [
                { r: r, o: o, l: l, e: e, ' s y s t e m ':  }, c, o, n, t, e, n, t, s, y, s, t, e, m, P, r, o, m, p, t, ., t, r, i, m, ()];
        }
        ();
        c;
        o;
        n;
        t;
        e;
        x;
        t;
        c;
        o;
        n;
        v;
        e;
        r;
        s;
        a;
        t;
        i;
        o;
        n;
        H;
        i;
        s;
        t;
        o;
        r;
        y;
         | ;
         | ;
        [];
        m;
        a;
        p;
        ();
        m;
        s;
        g;
         > ;
        ();
        {
            r;
            o;
            l;
            e;
            m;
            s;
            g;
            r;
            o;
            l;
            e;
            c;
            o;
            n;
            t;
            e;
            n;
            t;
            m;
            s;
            g;
            c;
            o;
            n;
            t;
            e;
            n;
            t;
        }
        {
            r;
            o;
            l;
            e;
            ' u s e r ';
            c;
            o;
            n;
            t;
            e;
            n;
            t;
            m;
            e;
            s;
            s;
            a;
            g;
            e;
        }
        s;
        t;
        r;
        e;
        a;
        m;
        f;
        a;
        l;
        s;
        e;
    }
    ;
    / /;
    M;
    a;
    k;
    e;
    r;
    e;
    q;
    u;
    e;
    s;
    t;
    t;
    o;
    O;
    l;
    l;
    a;
    m;
    a;
    A;
    P;
    I;
    w;
    i;
    t;
    h;
    t;
    i;
    m;
    e;
    o;
    u;
    t;
    c;
    o;
    n;
    s;
    t;
    c;
    o;
    n;
    t;
    r;
    o;
    l;
    l;
    e;
    r;
    n;
    e;
    w;
    A;
    b;
    o;
    r;
    t;
    C;
    o;
    n;
    t;
    r;
    o;
    l;
    l;
    e;
    r;
    ();
    ;
    c;
    o;
    n;
    s;
    t;
    t;
    i;
    m;
    e;
    o;
    u;
    t;
    I;
    d;
    s;
    e;
    t;
    T;
    i;
    m;
    e;
    o;
    u;
    t;
    ();
    ();
     > ;
    c;
    o;
    n;
    t;
    r;
    o;
    l;
    l;
    e;
    r;
    a;
    b;
    o;
    r;
    t;
    ();
    3;
    0;
    0;
    0;
    0;
    ;
    / /;
    3;
    0;
    s;
    e;
    c;
    o;
    n;
    d;
    t;
    i;
    m;
    e;
    o;
    u;
    t;
    c;
    o;
    n;
    s;
    t;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    a;
    w;
    a;
    i;
    t;
    f;
    e;
    t;
    c;
    h;
    ();
    "\0$\0{\0o\0l\0l\0a\0m\0a\0H\0o\0s\0t\0}\0/\0a\0p\0i\0/\0c\0h\0a\0t\0";
    {
        m;
        e;
        t;
        h;
        o;
        d;
        ' P O S T ';
        h;
        e;
        a;
        d;
        e;
        r;
        s;
        {
            ' C o n t e n t - T y p e ';
            ' a p p l i c a t i o n / j s o n ';
        }
        b;
        o;
        d;
        y;
        J;
        S;
        O;
        N;
        s;
        t;
        r;
        i;
        n;
        g;
        i;
        f;
        y;
        ();
        p;
        a;
        y;
        l;
        o;
        a;
        d;
        s;
        i;
        g;
        n;
        a;
        l;
        c;
        o;
        n;
        t;
        r;
        o;
        l;
        l;
        e;
        r;
        s;
        i;
        g;
        n;
        a;
        l;
    }
    ;
    c;
    l;
    e;
    a;
    r;
    T;
    i;
    m;
    e;
    o;
    u;
    t;
    ();
    t;
    i;
    m;
    e;
    o;
    u;
    t;
    I;
    d;
    ;
    i;
    f;
    ();
    !;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    o;
    k;
    {
        c;
        o;
        n;
        s;
        t;
        e;
        r;
        r;
        o;
        r;
        T;
        e;
        x;
        t;
        a;
        w;
        a;
        i;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        t;
        e;
        x;
        t;
        ();
        ;
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        "\0O\0l\0l\0a\0m\0a\0 \0A\0P\0I\0 \0e\0r\0r\0o\0r\0:\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0}\0 \0-\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0T\0e\0x\0t\0}\0";
        e;
        r;
        r;
        o;
        r;
        T;
        e;
        x;
        t;
        ;
        t;
        h;
        r;
        o;
        w;
        n;
        e;
        w;
        E;
        r;
        r;
        o;
        r;
        ();
        "\0O\0l\0l\0a\0m\0a\0 \0A\0P\0I\0 \0e\0r\0r\0o\0r\0:\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0}\0 \0-\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0T\0e\0x\0t\0}\0";
        ;
    }
    c;
    o;
    n;
    s;
    t;
    d;
    a;
    t;
    a;
    a;
    w;
    a;
    i;
    t;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    j;
    s;
    o;
    n;
    ();
    ;
    / /;
    C;
    h;
    e;
    c;
    k;
    i;
    f;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    h;
    a;
    s;
    t;
    h;
    e;
    e;
    x;
    p;
    e;
    c;
    t;
    e;
    d;
    s;
    t;
    r;
    u;
    c;
    t;
    u;
    r;
    e;
    i;
    f;
    ();
    !;
    d;
    a;
    t;
    a;
    m;
    e;
    s;
    s;
    a;
    g;
    e;
     | ;
     | ;
    !;
    d;
    a;
    t;
    a;
    m;
    e;
    s;
    s;
    a;
    g;
    e;
    c;
    o;
    n;
    t;
    e;
    n;
    t;
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        ' O l l a m a   A P I   r e t u r n e d   u n e x p e c t e d   r e s p o n s e   s t r u c t u r e : ';
        d;
        a;
        t;
        a;
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        n;
        u;
        l;
        l;
        ;
    }
    / /;
    E;
    x;
    t;
    r;
    a;
    c;
    t;
    t;
    h;
    e;
    A;
    I;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    c;
    o;
    n;
    s;
    t;
    a;
    i;
    R;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    d;
    a;
    t;
    a;
    m;
    e;
    s;
    s;
    a;
    g;
    e;
    c;
    o;
    n;
    t;
    e;
    n;
    t;
    t;
    r;
    i;
    m;
    ();
    ;
    / /;
    I;
    f;
    n;
    o;
    r;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    u;
    s;
    e;
    f;
    a;
    l;
    l;
    b;
    a;
    c;
    k;
    t;
    e;
    x;
    t;
    i;
    f;
    ();
    !;
    a;
    i;
    R;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        l;
        o;
        g;
        ();
        ' O l l a m a   r e t u r n e d   e m p t y   r e s p o n s e ,   f a l l i n g   b a c k   t o   r u l e - b a s e d   r e s p o n s e s ';
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        n;
        u;
        l;
        l;
        ;
    }
    / /;
    C;
    r;
    e;
    a;
    t;
    e;
    a;
    c;
    o;
    m;
    p;
    r;
    e;
    h;
    e;
    n;
    s;
    i;
    v;
    e;
    A;
    I;
    R;
    e;
    s;
    p;
    o;
    n;
    s;
    e;
    o;
    b;
    j;
    e;
    c;
    t;
    r;
    e;
    t;
    u;
    r;
    n;
    {
        t;
        e;
        x;
        t;
        a;
        i;
        R;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        s;
        u;
        g;
        g;
        e;
        s;
        t;
        i;
        o;
        n;
        s;
        [" F i n d   r e n t a l s ", , " L i s t   i t e m s ", , " C h e c k   b o o k i n g s ", , " V i e w   w i s h l i s t "];
    }
    ;
}
c;
a;
t;
c;
h;
();
e;
r;
r;
o;
r;
{
    i;
    f;
    ();
    e;
    r;
    r;
    o;
    r;
    n;
    a;
    m;
    e;
    ' A b o r t E r r o r ';
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        ' O l l a m a   r e q u e s t   t i m e d   o u t ';
        ;
    }
    e;
    l;
    s;
    e;
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        ' E r r o r   p r o c e s s i n g   w i t h   O l l a m a : ';
        e;
        r;
        r;
        o;
        r;
        ;
    }
    r;
    e;
    t;
    u;
    r;
    n;
    n;
    u;
    l;
    l;
    ;
}
/ * * ;
 * ;
C;
h;
e;
c;
k;
O;
l;
l;
a;
m;
a;
s;
e;
r;
v;
i;
c;
e;
h;
e;
a;
l;
t;
h;
 * ;
r;
e;
t;
u;
r;
n;
s;
W;
h;
e;
t;
h;
e;
r;
O;
l;
l;
a;
m;
a;
s;
e;
r;
v;
i;
c;
e;
i;
s;
a;
c;
c;
e;
s;
s;
i;
b;
l;
e;
 * ;
/ ;
p;
u;
b;
l;
i;
c;
a;
s;
y;
n;
c;
c;
h;
e;
c;
k;
O;
l;
l;
a;
m;
a;
H;
e;
a;
l;
t;
h;
();
P;
r;
o;
m;
i;
s;
e;
;
b;
o;
o;
l;
e;
a;
n;
 > ;
{
    t;
    r;
    y;
    {
        / /;
        C;
        h;
        e;
        c;
        k;
        i;
        f;
        O;
        l;
        l;
        a;
        m;
        a;
        i;
        s;
        e;
        n;
        a;
        b;
        l;
        e;
        d;
        i;
        f;
        ();
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        E;
        N;
        A;
        B;
        L;
        E;
        D;
        !;
        ' t r u e ';
        {
            r;
            e;
            t;
            u;
            r;
            n;
            f;
            a;
            l;
            s;
            e;
            ;
        }
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        H;
        o;
        s;
        t;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        H;
        O;
        S;
        T;
         | ;
         | ;
        ' h t t p : / / l o c a l h o s t : 1 1 4 3 4 ';
        ;
        / /;
        M;
        a;
        k;
        e;
        r;
        e;
        q;
        u;
        e;
        s;
        t;
        t;
        o;
        O;
        l;
        l;
        a;
        m;
        a;
        A;
        P;
        I;
        h;
        e;
        a;
        l;
        t;
        h;
        e;
        n;
        d;
        p;
        o;
        i;
        n;
        t;
        c;
        o;
        n;
        s;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        a;
        w;
        a;
        i;
        t;
        f;
        e;
        t;
        c;
        h;
        ();
        "\0$\0{\0o\0l\0l\0a\0m\0a\0H\0o\0s\0t\0}\0/\0a\0p\0i\0/\0t\0a\0g\0s\0";
        {
            m;
            e;
            t;
            h;
            o;
            d;
            ' G E T ';
            s;
            i;
            g;
            n;
            a;
            l;
            A;
            b;
            o;
            r;
            t;
            S;
            i;
            g;
            n;
            a;
            l;
            t;
            i;
            m;
            e;
            o;
            u;
            t;
            ();
            5;
            0;
            0;
            0;
            / /;
            5;
            s;
            e;
            c;
            o;
            n;
            d;
            t;
            i;
            m;
            e;
            o;
            u;
            t;
        }
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        o;
        k;
        ;
    }
    c;
    a;
    t;
    c;
    h;
    ();
    e;
    r;
    r;
    o;
    r;
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        ' O l l a m a   h e a l t h   c h e c k   e r r o r : ';
        e;
        r;
        r;
        o;
        r;
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        f;
        a;
        l;
        s;
        e;
        ;
    }
}
/ * * ;
 * ;
C;
h;
e;
c;
k;
i;
f;
t;
h;
e;
r;
e;
q;
u;
i;
r;
e;
d;
O;
l;
l;
a;
m;
a;
m;
o;
d;
e;
l;
i;
s;
a;
v;
a;
i;
l;
a;
b;
l;
e;
 * ;
r;
e;
t;
u;
r;
n;
s;
W;
h;
e;
t;
h;
e;
r;
t;
h;
e;
r;
e;
q;
u;
i;
r;
e;
d;
m;
o;
d;
e;
l;
i;
s;
a;
v;
a;
i;
l;
a;
b;
l;
e;
 * ;
/ ;
p;
u;
b;
l;
i;
c;
a;
s;
y;
n;
c;
c;
h;
e;
c;
k;
O;
l;
l;
a;
m;
a;
M;
o;
d;
e;
l;
();
P;
r;
o;
m;
i;
s;
e;
;
b;
o;
o;
l;
e;
a;
n;
 > ;
{
    t;
    r;
    y;
    {
        / /;
        C;
        h;
        e;
        c;
        k;
        i;
        f;
        O;
        l;
        l;
        a;
        m;
        a;
        i;
        s;
        e;
        n;
        a;
        b;
        l;
        e;
        d;
        i;
        f;
        ();
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        E;
        N;
        A;
        B;
        L;
        E;
        D;
        !;
        ' t r u e ';
        {
            r;
            e;
            t;
            u;
            r;
            n;
            f;
            a;
            l;
            s;
            e;
            ;
        }
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        H;
        o;
        s;
        t;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        H;
        O;
        S;
        T;
         | ;
         | ;
        ' h t t p : / / l o c a l h o s t : 1 1 4 3 4 ';
        ;
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        M;
        o;
        d;
        e;
        l;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        M;
        O;
        D;
        E;
        L;
         | ;
         | ;
        ' l l a m a 3 . 1 : 8 b ';
        ;
        / /;
        G;
        e;
        t;
        l;
        i;
        s;
        t;
        o;
        f;
        a;
        v;
        a;
        i;
        l;
        a;
        b;
        l;
        e;
        m;
        o;
        d;
        e;
        l;
        s;
        c;
        o;
        n;
        s;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        a;
        w;
        a;
        i;
        t;
        f;
        e;
        t;
        c;
        h;
        ();
        "\0$\0{\0o\0l\0l\0a\0m\0a\0H\0o\0s\0t\0}\0/\0a\0p\0i\0/\0t\0a\0g\0s\0";
        {
            m;
            e;
            t;
            h;
            o;
            d;
            ' G E T ';
            s;
            i;
            g;
            n;
            a;
            l;
            A;
            b;
            o;
            r;
            t;
            S;
            i;
            g;
            n;
            a;
            l;
            t;
            i;
            m;
            e;
            o;
            u;
            t;
            ();
            5;
            0;
            0;
            0;
            / /;
            5;
            s;
            e;
            c;
            o;
            n;
            d;
            t;
            i;
            m;
            e;
            o;
            u;
            t;
        }
        ;
        i;
        f;
        ();
        !;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        o;
        k;
        {
            r;
            e;
            t;
            u;
            r;
            n;
            f;
            a;
            l;
            s;
            e;
            ;
        }
        c;
        o;
        n;
        s;
        t;
        d;
        a;
        t;
        a;
        a;
        w;
        a;
        i;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        j;
        s;
        o;
        n;
        ();
        ;
        / /;
        C;
        h;
        e;
        c;
        k;
        i;
        f;
        t;
        h;
        e;
        r;
        e;
        q;
        u;
        i;
        r;
        e;
        d;
        m;
        o;
        d;
        e;
        l;
        i;
        s;
        i;
        n;
        t;
        h;
        e;
        l;
        i;
        s;
        t;
        i;
        f;
        ();
        d;
        a;
        t;
        a;
        m;
        o;
        d;
        e;
        l;
        s;
         & ;
         & ;
        A;
        r;
        r;
        a;
        y;
        i;
        s;
        A;
        r;
        r;
        a;
        y;
        ();
        d;
        a;
        t;
        a;
        m;
        o;
        d;
        e;
        l;
        s;
        {
            r;
            e;
            t;
            u;
            r;
            n;
            d;
            a;
            t;
            a;
            m;
            o;
            d;
            e;
            l;
            s;
            s;
            o;
            m;
            e;
            ();
            ();
            m;
            o;
            d;
            e;
            l;
            a;
            n;
            y;
             > ;
            m;
            o;
            d;
            e;
            l;
            n;
            a;
            m;
            e;
            o;
            l;
            l;
            a;
            m;
            a;
            M;
            o;
            d;
            e;
            l;
            ;
        }
        r;
        e;
        t;
        u;
        r;
        n;
        f;
        a;
        l;
        s;
        e;
        ;
    }
    c;
    a;
    t;
    c;
    h;
    ();
    e;
    r;
    r;
    o;
    r;
    {
        c;
        o;
        n;
        s;
        o;
        l;
        e;
        e;
        r;
        r;
        o;
        r;
        ();
        ' O l l a m a   m o d e l   c h e c k   e r r o r : ';
        e;
        r;
        r;
        o;
        r;
        ;
        r;
        e;
        t;
        u;
        r;
        n;
        f;
        a;
        l;
        s;
        e;
        ;
    }
}
/ * * ;
 * ;
T;
e;
s;
t;
O;
l;
l;
a;
m;
a;
c;
o;
n;
n;
e;
c;
t;
i;
v;
i;
t;
y;
 * ;
r;
e;
t;
u;
r;
n;
s;
C;
o;
n;
n;
e;
c;
t;
i;
v;
i;
t;
y;
t;
e;
s;
t;
r;
e;
s;
u;
l;
t;
s;
 * ;
/ ;
p;
u;
b;
l;
i;
c;
a;
s;
y;
n;
c;
t;
e;
s;
t;
O;
l;
l;
a;
m;
a;
C;
o;
n;
n;
e;
c;
t;
i;
v;
i;
t;
y;
();
P;
r;
o;
m;
i;
s;
e;
;
{
    s;
    u;
    c;
    c;
    e;
    s;
    s;
    b;
    o;
    o;
    l;
    e;
    a;
    n;
    ;
    e;
    r;
    r;
    o;
    r;
    s;
    t;
    r;
    i;
    n;
    g;
}
 > ;
{
    t;
    r;
    y;
    {
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        H;
        o;
        s;
        t;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        H;
        O;
        S;
        T;
         | ;
         | ;
        ' h t t p : / / l o c a l h o s t : 1 1 4 3 4 ';
        ;
        c;
        o;
        n;
        s;
        t;
        o;
        l;
        l;
        a;
        m;
        a;
        M;
        o;
        d;
        e;
        l;
        p;
        r;
        o;
        c;
        e;
        s;
        s;
        e;
        n;
        v;
        O;
        L;
        L;
        A;
        M;
        A;
        _;
        M;
        O;
        D;
        E;
        L;
         | ;
         | ;
        ' l l a m a 3 . 1 : 8 b ';
        ;
        / /;
        T;
        e;
        s;
        t;
        c;
        o;
        n;
        n;
        e;
        c;
        t;
        i;
        o;
        n;
        t;
        o;
        O;
        l;
        l;
        a;
        m;
        a;
        c;
        o;
        n;
        s;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        a;
        w;
        a;
        i;
        t;
        f;
        e;
        t;
        c;
        h;
        ();
        "\0$\0{\0o\0l\0l\0a\0m\0a\0H\0o\0s\0t\0}\0/\0a\0p\0i\0/\0t\0a\0g\0s\0";
        {
            m;
            e;
            t;
            h;
            o;
            d;
            ' G E T ';
            s;
            i;
            g;
            n;
            a;
            l;
            A;
            b;
            o;
            r;
            t;
            S;
            i;
            g;
            n;
            a;
            l;
            t;
            i;
            m;
            e;
            o;
            u;
            t;
            ();
            5;
            0;
            0;
            0;
        }
        ;
        i;
        f;
        ();
        !;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        o;
        k;
        {
            r;
            e;
            t;
            u;
            r;
            n;
            {
                s;
                u;
                c;
                c;
                e;
                s;
                s;
                f;
                a;
                l;
                s;
                e;
                e;
                r;
                r;
                o;
                r;
                "\0O\0l\0l\0a\0m\0a\0 \0A\0P\0I\0 \0n\0o\0t\0 \0a\0c\0c\0e\0s\0s\0i\0b\0l\0e\0:\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0}\0 \0-\0 \0$\0{\0r\0e\0s\0p\0o\0n\0s\0e\0.\0s\0t\0a\0t\0u\0s\0T\0e\0x\0t\0}\0";
            }
            ;
        }
        c;
        o;
        n;
        s;
        t;
        d;
        a;
        t;
        a;
        a;
        w;
        a;
        i;
        t;
        r;
        e;
        s;
        p;
        o;
        n;
        s;
        e;
        j;
        s;
        o;
        n;
        ();
        ;
        / /;
        C;
        h;
        e;
        c;
        k;
        i;
        f;
        t;
        h;
        e;
        r;
        e;
        q;
        u;
        i;
        r;
        e;
        d;
        m;
        o;
        d;
        e;
        l;
        i;
        s;
        a;
        v;
        a;
        i;
        l;
        a;
        b;
        l;
        e;
        c;
        o;
        n;
        s;
        t;
        m;
        o;
        d;
        e;
        l;
        E;
        x;
        i;
        s;
        t;
        s;
        d;
        a;
        t;
        a;
        m;
        o;
        d;
        e;
        l;
        s;
        s;
        o;
        m;
        e;
        ();
        ();
        m;
        o;
        d;
        e;
        l;
        a;
        n;
        y;
         > ;
        m;
        o;
        d;
        e;
        l;
        n;
        a;
        m;
        e;
        o;
        l;
        l;
        a;
        m;
        a;
        M;
        o;
        d;
        e;
        l;
        ;
        i;
        f;
        ();
        !;
        m;
        o;
        d;
        e;
        l;
        E;
        x;
        i;
        s;
        t;
        s;
        {
            r;
            e;
            t;
            u;
            r;
            n;
            {
                s;
                u;
                c;
                c;
                e;
                s;
                s;
                f;
                a;
                l;
                s;
                e;
                e;
                r;
                r;
                o;
                r;
                "\0R\0e\0q\0u\0i\0r\0e\0d\0 \0m\0o\0d\0e\0l\0 \0$\0{\0o\0l\0l\0a\0m\0a\0M\0o\0d\0e\0l\0}\0 \0n\0o\0t\0 \0f\0o\0u\0n\0d\0 \0i\0n\0 \0O\0l\0l\0a\0m\0a\0";
            }
            ;
        }
        r;
        e;
        t;
        u;
        r;
        n;
        {
            s;
            u;
            c;
            c;
            e;
            s;
            s;
            t;
            r;
            u;
            e;
        }
        ;
    }
    c;
    a;
    t;
    c;
    h;
    ();
    e;
    r;
    r;
    o;
    r;
    {
        r;
        e;
        t;
        u;
        r;
        n;
        {
            s;
            u;
            c;
            c;
            e;
            s;
            s;
            f;
            a;
            l;
            s;
            e;
            e;
            r;
            r;
            o;
            r;
            "\0F\0a\0i\0l\0e\0d\0 \0t\0o\0 \0c\0o\0n\0n\0e\0c\0t\0 \0t\0o\0 \0O\0l\0l\0a\0m\0a\0:\0 \0$\0{\0e\0r\0r\0o\0r\0 \0i\0n\0s\0t\0a\0n\0c\0e\0o\0f\0 \0E\0r\0r\0o\0r\0 \0?\0 \0e\0r\0r\0o\0r\0.\0m\0e\0s\0s\0a\0g\0e\0 \0:\0 \0'\0U\0n\0k\0n\0o\0w\0n\0 \0e\0r\0r\0o\0r\0'\0}\0";
        }
        ;
    }
}
/ /;
E;
x;
p;
o;
r;
t;
s;
i;
n;
g;
l;
e;
t;
o;
n;
i;
n;
s;
t;
a;
n;
c;
e;
e;
x;
p;
o;
r;
t;
c;
o;
n;
s;
t;
r;
e;
n;
A;
I;
S;
e;
r;
v;
i;
c;
e;
n;
e;
w;
R;
e;
n;
A;
I;
S;
e;
r;
v;
i;
c;
e;
();
;
var templateObject_1;
