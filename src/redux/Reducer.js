import {combineReducers} from 'redux';
import {
  LOGIN_ROOT,
  USER_ROOT,
  SIGNUP_ROOT,
  VERIFYOTP_ROOT,
  VERIFY_DOCUMENTS_ROOT,
  CHANGE_PASSWORD_ROOT,
  PROFILE_ROOT,
  HOME_ROOT,
  RIDE_ROOT,
  PICK_UP_RIDE_ROOT,
  GET_BANK_CODE_ROOT,
  ADD_BANK_DETAILS_ROOT,
  RATINGS_ROOT,
  SUPPORT_ROOT,
  UPCOMING_ROOT,
  COMPLETED_ROOT,
  MY_RIDE_TAB_ROOT,
  RANKING_ROOT,
  WALLET_ROOT,
  REFERRAL_CODE_ROOT,
  MY_EARNINGS_ROOT,
  FORGOT_PASS_ROOT,
  CHAT_WITH_ADMIN_ROOT,
  CHAT_WITH_CUSTOMER_ROOT,
  NOTIFICATION_ROOT,
  BONUS_ROOT,
} from './Types';
import Login from './login/Reducer';
import User from './user/Reducer';
import SignUp from './signUp/Reducer';
import VerifySignUp from './SignUpVerifyOtp/Reducer';
import VerifyDocuments from './VerifyDocuments/Reducer';
import ChangePassword from './changePassword/Reducer';
import Profile from './profile/Reducer';
import Home from './home/Reducer';
import DriverRide from './driverRide/Reducer';
import PickUpRide from './PickUpRide/Reducer';
import GetBankCode from './getBankCode/Reducer';
import AddBankDetails from './addBankDetails/Reducer';
import Rating from './rating/Reducer';
import Support from './support/Reducer';
import Upcoming from './Upcoming/Reducer';
import Completed from './completed/Reducer';
import MyRideTab from './MyRideTab/Reducer';
import DriverRanking from './driverRanking/Reducer';
import DriverWallet from './driverWallet/Reducer';
import ReferralCode from './referralCode/Reducer';
import DriverEarnings from './driverEarnings/Reducer';
import ForgotPass from './forgotPass/Reducer';
import ChatWithAdmin from './chatWithAdmin/Reducer';
import ChatWithCustomer from './chatWithCustomer/Reducer';
import Notification from './notification/Reducer';
import Bonus from './bonus/Reducer';

export default combineReducers({
  [LOGIN_ROOT]: Login,
  [USER_ROOT]: User,
  [SIGNUP_ROOT]: SignUp,
  [VERIFYOTP_ROOT]: VerifySignUp,
  [VERIFY_DOCUMENTS_ROOT]: VerifyDocuments,
  [CHANGE_PASSWORD_ROOT]: ChangePassword,
  [PROFILE_ROOT]: Profile,
  [HOME_ROOT]: Home,
  [RIDE_ROOT]: DriverRide,
  [PICK_UP_RIDE_ROOT]: PickUpRide,
  [GET_BANK_CODE_ROOT]: GetBankCode,
  [ADD_BANK_DETAILS_ROOT]: AddBankDetails,
  [RATINGS_ROOT]: Rating,
  [SUPPORT_ROOT]: Support,
  [UPCOMING_ROOT]: Upcoming,
  [COMPLETED_ROOT]: Completed,
  [MY_RIDE_TAB_ROOT]: MyRideTab,
  [RANKING_ROOT]: DriverRanking,
  [WALLET_ROOT]: DriverWallet,
  [REFERRAL_CODE_ROOT]: ReferralCode,
  [MY_EARNINGS_ROOT]: DriverEarnings,
  [FORGOT_PASS_ROOT]: ForgotPass,
  [CHAT_WITH_ADMIN_ROOT]: ChatWithAdmin,
  [CHAT_WITH_CUSTOMER_ROOT]: ChatWithCustomer,
  [NOTIFICATION_ROOT]: Notification,
  [BONUS_ROOT]: Bonus,
});
