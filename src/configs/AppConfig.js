const appSettings = {
  // base_url:  'https://taxiapp.chubbyminds.com',
  base_url: 'https://payride.ng',
};

let variable = appSettings;

if (__DEV__) {
  variable = appSettings;
}

export default variable;
