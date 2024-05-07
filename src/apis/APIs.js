import AppConfig from '../configs/AppConfig';
import Utils from '../common/util/Utils';
import NetInfo from '@react-native-community/netinfo';
import {ERROR, INTERNET_ERROR} from '../redux/Types';

export const RESOURCE_URL = AppConfig.base_url;

export const POST = async (baseUrl, endpoint, body) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = body.token || '';
  if (res) {
    return fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + usertoken,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(Object.assign(body)) : undefined,
    }).then(Utils.verifyResponse);
  }
  //Alert.alert("Notification",'No internet connection');
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};
const POST_REQUEST_WITH_PROMISE = async (baseUrl, endpoint, body) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = body.token ? body.token : '';
  if (res) {
    return new Promise((resolve, rejects) => {
      fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + usertoken,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(Object.assign(body)) : undefined,
      })
        .then(response => response.json())
        .then(async response => {
          let data = await response;
          resolve(data);
        })
        .catch(e => console.log('usertoken error', e));
    });
  }
  //Alert.alert("Notification",'No internet connection');
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};
const POSTFILEUPLOAD = async (baseUrl, endpoint, body, Usertoken) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = Usertoken ? Usertoken : '';

  // Utils.log('${baseUrl}${endpoint}--------', `${baseUrl}${endpoint}`);
  // Utils.log('usertoken', usertoken, body);
  if (res) {
    return fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + usertoken,
        'Content-Type': 'multipart/form-data',
      },
      body: body,
    }).then(Utils.verifyResponse);
  }
  //Alert.alert("Notification",'No internet connection');
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};

export const GET = async (baseUrl, endpoint, body) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = body && body.token ? body.token : '';
  if (res) {
    return fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + usertoken,
        'Content-Type': 'application/json',
      },
    }).then(Utils.verifyResponse);
  }
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};
export const GET_WITH_PROMISE = async (baseUrl, endpoint, body) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = body && body.token ? body.token : '';
  if (res) {
    return new Promise(resolve => {
      return fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + usertoken,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(response => resolve(response))
        .catch(e => console.log('usertoken error', e));
    });
  }
  //Alert.alert("Notification",'No internet connection');
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};
const PUT = async (baseUrl, endpoint, body) => {
  const netStatus = await NetInfo.fetch();
  const res = netStatus.isConnected;
  const usertoken = body.token ? body.token : '';
  if (res) {
    return fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + usertoken,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(Object.assign(body)) : undefined,
    }).then(Utils.verifyResponse);
  }
  //Alert.alert("Notification",'No internet connection');
  return new Promise((resolve, rejects) =>
    rejects({
      ['message']: res ? ERROR : INTERNET_ERROR,
    }),
  );
};

export const Login = body =>
  POST(RESOURCE_URL, `/api/driver/login`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const ForgotPass = body =>
  POST(RESOURCE_URL, `/api/driver/forgot-password`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const SignUpVerifyOtp = body =>
  POST(RESOURCE_URL, `/api/driver/signup-verify-otp`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const SignUpGenerateOtp = body =>
  POST(RESOURCE_URL, `/api/driver/signup-generate-otp`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const UploadDocuments = (body, Usertoken) =>
  POSTFILEUPLOAD(RESOURCE_URL, `/api/driver/upload-docs`, body, Usertoken)
    .then(response => response.json())
    .catch(Utils.handleError);

export const GetUserDocuments = body =>
  GET(RESOURCE_URL, `/api/driver/get-docs`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const ChangePassword = body =>
  POST(RESOURCE_URL, `/api/driver/change-password`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const ProfileApi = (body, Usertoken) =>
  POSTFILEUPLOAD(RESOURCE_URL, `/api/driver/update-profile`, body, Usertoken)
    .then(response => response.json())
    .catch(Utils.handleError);

export const ServiceAvailablility = body =>
  POST(RESOURCE_URL, `/api/driver/set-availability`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const SendCurrentLocationAtEveryInterval = body =>
  POST(RESOURCE_URL, `/api/driver/set-location`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const RideDetails = body =>
  POST(RESOURCE_URL, `/api/driver/ride-detail`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const RideRejected = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/rejected`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const SOSRequest = async body => {
  const data = await POST_REQUEST_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/sos-request`,
    body,
  );
  return data;
};
export const SOSRequestLiveLocation = async body => {
  const data = await POST_REQUEST_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/sos-live-location`,
    body,
  );
  return data;
};
export const dropOfLocationChangeByRider = async (body, rideId, layOverId) => {
  const data = await POST_REQUEST_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/ride/response-change-dropoff-location/${rideId}/${layOverId}`,
    body,
  );
  return data;
};
export const AutoRejectedRideByUser = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/not_accepted`, body)
    .then(response => response.json())
    .then(response =>
      console.log('AutoRejectedRideByUser api response==>', response),
    )
    .catch(Utils.handleError);

export const RideAccepted = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/accepted`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const RideCancelledApi = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/cancelled_driver`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const RideArrivedApi = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/arrived`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const RideStartedApi = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/started`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const GetBankCodes = body =>
  GET(RESOURCE_URL, `/api/payments/banks`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const AddBankAccount = body =>
  POST(RESOURCE_URL, `/api/payments/add-bank-account`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const Rating = body =>
  POST(RESOURCE_URL, `/api/driver/rider-rating`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const Support = body =>
  POST(RESOURCE_URL, `/api/driver/support-ticket/add`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const LogOut = body =>
  GET(RESOURCE_URL, '/api/driver/logout', body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const DeleteAccount = body =>
  GET(RESOURCE_URL, '/api/driver/deleteAccount', body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const SupportTicketListing = body =>
  GET(RESOURCE_URL, `/api/driver/support-ticket/list`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const Notification = body =>
  GET(RESOURCE_URL, `/api/driver/notifications`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const UpcomingRideCount = async body => {
  const data = await GET_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/upcoming-ride-count`,
    body,
  );
  return data;
};
export const getDriverStatus = async body => {
  // GET(RESOURCE_URL, '/api/driver/get-details', body)
  //   .then(response => response.json())
  //   .catch(Utils.handleError);
  const data = await GET_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/get-details`,
    body,
  );
  return data;
};
export const cancelReasonList = async body => {
  const data = await GET_WITH_PROMISE(
    RESOURCE_URL,
    `/api/common/cancellation-reasons/Driver`,
    body,
  );
  return data;
};
export const currentRideDetails = async body => {
  const data = await GET_WITH_PROMISE(
    RESOURCE_URL,
    '/api/driver/current-ride',
    body,
  );
  return data;
};
export const DriverRating = async body => {
  const data = await GET_WITH_PROMISE(RESOURCE_URL, `/api/driver/rating`, body);
  return data;
};
export const HeatMap = async body => {
  const data = await GET_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/heat-map`,
    body,
  );
  return data;
};
export const Bonus = body =>
  GET(RESOURCE_URL, `/api/driver/bonus`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const GetBankDetails = body =>
  GET(RESOURCE_URL, `/api/driver/bank-account`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const Upcoming = body =>
  GET(RESOURCE_URL, `/api/driver/get-rides/upcoming`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const Completed = body =>
  GET(RESOURCE_URL, `/api/driver/get-rides/completed`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const DriverRanking = body =>
  GET(RESOURCE_URL, `/api/driver/ranking`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const DriverWalletApi = body =>
  GET(RESOURCE_URL, `/api/driver/wallet/ledger`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const TransferToAdmin = body =>
  POST(RESOURCE_URL, `/api/payments/transfer`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const DriverReferralApi = body =>
  GET(RESOURCE_URL, `/api/driver/referral-code`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const CashPaymentReceivedApi = body =>
  POST_REQUEST_WITH_PROMISE(
    RESOURCE_URL,
    `/api/driver/ride/set-status/completed`,
    body,
  )
    .then(response => response)
    .catch(Utils.handleError);

export const RideCompleted = body =>
  POST(RESOURCE_URL, `/api/driver/ride/set-status/complete_step1`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const MyDriverEarnings = body =>
  POST(RESOURCE_URL, `/api/driver/my-earnings`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const DriverGetAdminChatListApi = (body, url) =>
  GET(RESOURCE_URL, url, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const SendChatToAdmin = body =>
  POST(RESOURCE_URL, `/api/driver/admin/chat/send`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const CustomerChatListApi = body =>
  POST(RESOURCE_URL, `/api/driver/rider/chat/list`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const SendChatToCustomer = body =>
  POST(RESOURCE_URL, `/api/driver/rider/chat/send`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const ReadSingleNotification = body =>
  POST(RESOURCE_URL, `/api/driver/notifications/mark-read-single`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const ReadAllChatForRide = body =>
  POST_REQUEST_WITH_PROMISE(RESOURCE_URL, `/api/driver/rider/read-all`, body)
    .then(response => response)
    .catch(Utils.handleError);
export const ReadAllAdminChat = (body, url) =>
  GET(RESOURCE_URL, url, body)
    .then(response => response.json())
    .catch(Utils.handleError);
