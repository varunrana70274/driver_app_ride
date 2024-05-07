/** Common Constants */
export const SUCCESS = 'success';
export const UPDATE = 'update';
export const ERROR = 'error';
export const MESSAGE = 'message';
export const STATUS = 'status';
export const RESPONSE = 'response';
export const EMPTY = 'empty';
export const SILENT_LOGOUT = 'silent_logout';
export const IS_ADMIN_CHAT_SCREEN = 'IS_ADMIN_CHAT_SCREEN';
export const INTERNET_ERROR = 'No internet connection';
// Async storage
export const ASYNC_LOGIN_DATA = 'async_login_data';
export const ASYNC_LOGIN_CREDENTIALS = 'async_login_credentials';
export const ASYNC_RIDE_DATA = 'async_ride_data';
export const ASYNC_ACCEPTED_RIDE_DATA = 'async_ride_accepted_data';
export const ASYNC_PAYMENT_COLLECTED_DATA = 'async_payment_collected_data';
export const ASYNC_RATING_SCREEN_DATA = 'async_rating_screen_data';

/** Login constant key **/

export const LOGIN_ROOT = 'login';
export const LOGIN_UPDATE = 'login_update';
export const LOGIN_RESET = 'login_reset';
export const LOGIN_KEY = 'login_key';
export const LOGIN_VISIBILITY_PASSSWORD = 'login_visibility_password';

export const LOGIN_REQEUST_LOADING = 'login_request_loading';
export const LOGIN_FORM_EMAIL = 'login_form_email';
export const LOGIN_FORM_PASSWORD = 'login_form_password';
export const RESET_USER = 'RESET_USER';
export const CANCEL_REASON_LIST = 'CANCEL_REASON_LIST';
export const DESTROY_SESSION = 'DESTROY_SESSION';
/** SignUp constant key **/
export const SIGNUP_ROOT = 'signup';
export const SIGNUP_KEY = 'signup_key';
export const SIGNUP_UPDATE = 'signup_update';
export const SIGNUP_RESET = 'signup_reset';
export const SIGNUP_EMAIL = 'signup_email';
export const SIGNUP_PASSWORD = 'signup_password';
export const SIGNUP_REQEUST_LOADING = 'signup_request_loading';
export const SIGNUP_VISIBILITY_PASSSWORD = 'signup_visibility_password';
export const SIGNUP_VISIBILITY_CONFIRM_PASSSWORD =
  'signup_visibility_confirm_password';
export const SIGNUP_SUCCESS = 'signup_success';
export const SIGNUP_BODY = 'signup_body';
export const SOCIAL_LOGIN_BODY = 'social_login_body';

/** Forgot Pass key **/

export const FORGOT_PASS_KEY = 'forgot_pass_key';
export const FORGOT_PASS_ROOT = 'forgot_pass';
export const FORGOT_PASS_UPDATE = 'forgot_pass_update';
export const FORGOT_PASS_RESET = 'forgot_pass_reset';
export const FORGOT_PASS_LOADING = 'forgot_pass_loading';
export const FORGOT_PASS_SUCCESS = 'forgot_pass_success';
export const FORGOT_PASS_EMAIL = 'forgot_pass_email';
export const FORGOT_PASS_OTP = 'forgot_pass_otp';

/** Verify otp key **/
export const VERIFYOTP_ROOT = 'verifyotp';
export const VERIFYOTP_KEY = 'verifyotp_key';
export const VERIFYOTP_REQEUST_LOADING = 'verifyotp_request_loading';
export const VERIFYOTP_UPDATE = 'verifyotp_update';
export const VERIFYOTP_RESET = 'verifyotp_reset';
export const VERIFYOTP_SUCCESS = 'verifyotp_success';

/** User constant key**/
export const USER_ROOT = 'user';
export const USER_UPDATE = 'user_update';
export const USER_RESET = 'user_reset';
export const USER_KEY = 'user_key';
export const DEVICE_ROUTE_LOADING = 'device_route_loading';
export const USER_DATA = 'user_data';
export const FCM_TOKEN = 'fcm_token';

/** Verify Documents key**/
export const VERIFY_DOCUMENTS_ROOT = 'verify_documents';
export const VERIFY_DOCUMENTS_KEY = 'verify_documents_key';
export const VERIFY_DOCUMENTS_RESET = 'verify_documents_reset';
export const VERIFY_DOCUMENTS_UPDATE = 'verify_documents_update';
export const VERIFY_DOCUMENTS_SUCCESS = 'verify_documents_success';
export const VERIFY_DOCUMENTS_REQUEST_LOADING =
  'verify_documents_request_loading';
export const GET_DOCUMENTS = 'get_documents';
export const GET_DOCUMENTS_REQUEST_LOADING = 'get_documents_request_loading';

/** Change Password key**/
export const CHANGE_PASSWORD_ROOT = 'change_password';
export const CHANGE_PASSWORD_KEY = 'change_password_key';
export const CHANGE_PASSWORD_UPDATE = 'change_password_update';
export const CHANGE_PASSWORD_REQEUST_LOADING =
  'change_password_request_loading';
export const CHANGE_PASSWORD_SUCCESS = 'change_password_success';
export const CHANGE_PASSWORD_ERROR = 'change_password_error';

/** Change Profile key**/
export const PROFILE_ROOT = 'profile';
export const PROFILE_KEY = 'profile_key';
export const PROFILE_UPDATE = 'profile_update';
export const PROFILE_REQEUST_LOADING = 'profile_request_loading';
export const PROFILE_RESET = 'profile_reset';
export const PROFILE_SUCCESS = 'profile_success';

/** Change Home key**/
export const HOME_ROOT = 'home';
export const HOME_KEY = 'home_key';
export const HOME_UPDATE = 'home_update';
export const HOME_REGION = 'home_region';
export const HOME_RESET = 'home_reset';
export const CALL_COMPONENT_DID_MOUNT = 'call_component_did_mount';
export const SOS_REQUEST_COMPLETE = 'SOS_REQUEST_COMPLETE';

/** Ride key**/
export const RIDE_ROOT = 'ride';
export const RIDE_KEY = 'ride_key';
export const RIDE_UPDATE = 'ride_update';
export const RIDE_RESET = 'ride_reset';
export const RIDE_SET_AVAILABILITY = 'ride_set_availability';
export const PENDING_RIDE_REQUESTS = 'pending_ride_requests';
export const ANY_CURRENT_RIDE = 'any_current_ride';
export const RIDE_SET_AVAILABILITY_REQUEST_LOADING =
  'ride_set_availability_request_loading';
export const AVAILABLE_SCHEDULE_RIDE = 'available_schedule_ride';
export const ANY_RIDE_REQUEST_PRESENT = 'any_ride_request_present';
export const RIDE_DETAILS_LOADING = 'ride_details_loading';
export const DRIVER_RATING_LOADING = 'driver_rating_loading';
export const RIDE_DETAILS_SUCCESS = 'ride_details_success';
export const RIDE_ACCETPTANCE_TIMER = 'ride_acceptance_timer';
export const RIDE_TIMER_INSTANCE = 'ride_timer_acceptance';
export const RIDE_ID = 'ride_id';
export const PICKUP_LATLNG = 'pickup_latlng';
export const DROPOFF_LATLNG = 'dropOff_latlng';
export const MAP_REF = 'map_ref';
export const ARRAY_OF_LATLONG = 'array_of_lat_long';
export const UPCOMING_RIDE_COUNT = 'upcoming_ride_count';
export const DRIVER_RATING = 'driver_rating';
export const RIDE_LATER = 'ride_later';
export const RIDE_LATER_ACCEPTANCE = 'ride_late_acceptance';
export const RIDE_TIMER_REF = 'RIDE_TIMER_REF';
export const HEAT_MAP_DATA = 'HEAT_MAP_DATA';
export const DRIVER_ACTIVE_STATUS = 'DRIVER_ACTIVE_STATUS';
export const DRIVER_ACTIVE_STATUS_VALUE = 'DRIVER_ACTIVE_STATUS_VALUE';
// PickUpRide

export const PICK_UP_RIDE_KEY = 'pick_up_ride_key';
export const PICK_UP_RIDE_ROOT = 'pick_up_ride';
export const PICK_UP_RIDE_UPDATE = 'pick_up_ride_update';
export const PICK_UP_RIDE_RESET = 'pick_up_ride_reset';
export const PICK_UP_REQUEST_LOADING = 'pick_up_request_loading';
export const PICK_UP_RIDE_ARRIVED = 'pick_up_ride_arrived';
export const PICK_UP_RIDE_CANCELLED = 'pick_up_ride_cancelled';
export const PICKUP_RIDE_STARTED = 'pick_up_ride_started';
export const PICKUP_AMOUNT_COLLECTED = 'pick_up_amount_collected';
export const PICKUP_RIDE_COMPLETED_SUCCESS = 'pick_up_ride_completed_success';
export const GO_TO_RATING_SCREEN = 'go_to_rating_screen';
export const CASH_PAYMENT_LOADER = 'cash_payment_loader';
export const RIDE_REMAINING_TIME = 'RIDE_REMAINING_TIME';
// Get Bank Code
export const GET_BANK_CODE_KEY = 'get_bank_code_key';
export const GET_BANK_CODE_ROOT = 'get_bank_code';
export const GET_BANK_CODE_UPDATE = 'get_bank_code_update';
export const GET_BANK_CODE_RESET = 'get_bank_code_reset';
export const GET_BANK_CODE_LOADING = 'get_bank_code_loading';
export const GET_BANK_CODE_SUCCESS = 'get_bank_code_success';
export const NEXT_BANK_CODE_META = 'next_bank_code_meta';
export const GET_BANK_CODE_FOOTER_LOADING = 'get_bank_code_footer_loading';
export const SELECT_BANK_OBJ = 'select_bank_obj';
export const BANK_CODE = 'bank_code';

// Bank Details
export const ADD_BANK_DETAILS_KEY = 'add_bank_details_key';
export const ADD_BANK_DETAILS_ROOT = 'add_bank_details';
export const ADD_BANK_DETAILS_UPDATE = 'add_bank_details_update';
export const ADD_BANK_DETAILS_RESET = 'add_bank_details_reset';
export const ADD_BANK_DETAILS_LOADING = 'add_bank_details_loading';
export const ADD_BANK_DETAILS_SUCCESS = 'add_bank_details_key_success';
export const DISPLAY_ACCOUNT_LOADER = 'display_account_loader';
export const DISPLAY_ACCOUNT_SUCCESS = 'display_account_success';

// Ratings
export const RATINGS_KEY = 'ratings_key';
export const RATINGS_ROOT = 'ratings';
export const RATINGS_UPDATE = 'ratings_update';
export const RATINGS_RESET = 'ratings_reset';
export const RATINGS_LOADING = 'ratings_loading';
export const RATINGS_SUCCESS = 'ratings_success';

// support
export const SUPPORT_KEY = 'support_key';
export const SUPPORT_ROOT = 'support';
export const SUPPORT_UPDATE = 'support_update';
export const SUPPORT_RESET = 'support_reset';
export const SUPPORT_LOADING = 'support_loading';
export const SUPPORT_SUCCESS = 'support_success';
export const SUPPORT_TICKET_LISTING_LOADER = 'support_ticket_listing_loader';
export const SUPPORT_TICKET_LISTING_SUCCESS = 'support_ticket_listing_success';

// Completed
export const COMPLETED_KEY = 'completed_key';
export const COMPLETED_ROOT = 'completed';
export const COMPLETED_UPDATE = 'completed_update';
export const COMPLETED_RESET = 'completed_reset';
export const COMPLETED_LOADING = 'completed_loading';
export const COMPLETED_SUCCESS = 'completed_success';
export const RIDE_ID_OF_RIDES = 'ride_id_of_rides';

//Upcoming
export const UPCOMING_KEY = 'upcoming_key';
export const UPCOMING_ROOT = 'upcoming';
export const UPCOMING_UPDATE = 'upcoming_update';
export const UPCOMING_RESET = 'upcoming_reset';
export const UPCOMING_LOADING = 'upcoming_loading';
export const UPCOMING_SUCCESS = 'upcoming_success';

// My Tab Ride
export const MY_RIDE_TAB_KEY = 'my_ride_tab_key';
export const MY_RIDE_TAB_ROOT = 'my_ride_tab';
export const MY_RIDE_TAB_UPDATE = 'my_ride_tab_update';
export const MY_RIDE_TAB_RESET = 'my_ride_tab_reset';
export const MY_RIDE_TAB_REQUEST_LOADING = 'my_ride_tab_request_loading';
export const MY_RIDE_TAB_SUCCESS = 'my_ride_tab_success';

//Ranking
export const RANKING_KEY = 'ranking';
export const RANKING_ROOT = 'ranking';
export const RANKING_UPDATE = 'ranking_update';
export const RANKING_RESET = 'ranking_reset';
export const RANKING_LOADING = 'ranking_loading';
export const RANKING_SUCCESS = 'ranking_success';

//bonus

export const BONUS_KEY = 'bonus_key';
export const BONUS_ROOT = 'bonus';
export const BONUS_UPDATE = 'bonus_update';
export const BONUS_RESET = 'bonus_reset';
export const BONUS_LOADING = 'bonus_loading';
export const BONUS_SUCCESS = 'bonus_success';

//WALLET
export const WALLET_KEY = 'wallet_key';
export const WALLET_ROOT = 'wallet';
export const WALLET_UPDATE = 'wallet_update';
export const WALLET_RESET = 'wallet_reset';
export const WALLET_LOADING = 'wallet_loading';
export const WALLET_SUCCESS = 'wallet_success';
export const WALLET_BALANCE = 'wallet_balance';
export const PAY_AMOUNT_TO_WALLET = 'pay_amount_to_wallet';
export const PAYMENT_TO_ADMIN_REQUEST_LOADING =
  'payment_to_admin_request_loading';

//Referral Code

export const REFERRAL_CODE_KEY = 'referral_code_key';
export const REFERRAL_CODE_ROOT = 'referral_code';
export const REFERRAL_CODE_UPDATE = 'referral_code_update';
export const REFERRAL_CODE_RESET = 'referral_code_reset';
export const REFERRAL_CODE_LOADING = 'referral_code_loading';
export const REFERRAL_CODE_SUCCESS = 'referral_code_success';

// COMPLETED Rides
export const COMPLETED_ONGOING_RIDE_KEY = 'completed_ongoing_ride_key';
export const COMPLETED_ONGOING_RIDE_ROOT = 'completed_ongoing_ride';
export const COMPLETED_ONGOING_RIDE_UPDATE = 'completed_ongoing_ride_update';
export const COMPLETED_ONGOING_RIDE_RESET = 'completed_ongoing_ride_reset';
export const COMPLETED_ONGOING_RIDE_LOADING = 'completed_ongoing_ride_loading';
export const COMPLETED_ONGOING_RIDE_SUCCESS = 'completed_ongoing_ride_success';

// Driver Cash Payment Received
export const CASH_PAYMENT_RECEIVED_KEY = 'cash_payment_received_key';
export const CASH_PAYMENT_RECEIVED_ROOT = 'cash_payment_received';
export const CASH_PAYMENT_RECEIVED_UPDATE = 'cash_payment_received_update';
export const CASH_PAYMENT_RECEIVED_RESET = 'cash_payment_received_reset';
export const CASH_PAYMENT_RECEIVED_LOADING = 'cash_payment_received_loading';
export const CASH_PAYMENT_RECEIVED_SUCCESS = 'cash_payment_received_success';

// My Earnings
export const MY_EARNINGS_ROOT = 'my_earnings';
export const MY_EARNINGS_KEY = 'my_earnings_key';
export const MY_EARNINGS_UPDATE = 'my_earnings_update';
export const MY_EARNINGS_REQEUST_LOADING = 'my_earnings_request_loading';
export const MY_EARNINGS_RESET = 'my_earnings_reset';
export const MY_EARNINGS_DAILY_SUCCESS = 'my_earnings_success';
export const MY_EARNINGS_WEEKLY_SUCCESS = 'my_earnings_weekly_success';
export const MY_EARNINGS_MONTHLY_SUCCESS = 'my_earnings_monthly_success';
export const MY_EARNINGS_YEARLY_SUCCESS = 'my_earnings_yearly_success';
export const MY_TOTAL_EARNINGS = 'my_total_earnings';
export const MY_EARNINGS_DATA = 'my_earnings_data';

//cHAT WITH ADMIN

export const CHAT_WITH_ADMIN_KEY = 'chat_with_admin_key';
export const CHAT_WITH_ADMIN_ROOT = 'chat_with_admin';
export const CHAT_WITH_ADMIN_UPDATE = 'chat_with_admin_update';
export const CHAT_WITH_ADMIN_RESET = 'chat_with_admin_reset';
export const CHAT_WITH_ADMIN_LOADING = 'chat_with_admin_loading';
export const CHAT_WITH_ADMIN_SUCCESS = 'chat_with_admin_success';
export const SEND_MESSAGE_TO_ADMIN_LOADER = 'send_message_to_admin_loader';
export const CURRENT_PAGE = 'current_page';
export const NEXT_PAGE_URL = 'next_page_url';
export const PREV_PAGE_URL = 'prev_page_url';
export const TOTAL_PAGES = 'total_pages';
export const TOTAL_RECORDS = 'total_records';

//Chat with customer
export const CHAT_WITH_CUSTOMER_KEY = 'chat_with_customer_key';
export const CHAT_WITH_CUSTOMER_ROOT = 'chat_with_customer';
export const CHAT_WITH_CUSTOMER_UPDATE = 'chat_with_customer_update';
export const CHAT_WITH_CUSTOMER_RESET = 'chat_with_customer_reset';
export const CHAT_WITH_CUSTOMER_LOADING = 'chat_with_customer_loading';
export const CHAT_WITH_CUSTOMER_SUCCESS = 'chat_with_customer_success';
export const SEND_MESSAGE_TO_CUSTOMER = 'send_message_to_customer';

//Notification
export const NOTIFICATION_KEY = 'notification_key';
export const NOTIFICATION_ROOT = 'notification';
export const NOTIFICATION_UPDATE = 'notification_update';
export const NOTIFICATION_RESET = 'notification_reset';
export const NOTIFICATION_REQUEST_LOADING = 'notification_request_loading';
export const NOTIFICATION_SUCCESS = 'notification_success';
