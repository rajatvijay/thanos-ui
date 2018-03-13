const initialState = {
  users: [],
  usersFetching: false,
  usersFetched: false
};

const usersList = [
  {
    username: "junaid lone",
    initials: "JL",
    id: 1,
    email: "junaid@thevetted.com",
    phone: "+91 9123456789",
    rating: 4,
    relatedWorkflow: 2,
    company: "TheVetted"
  },
  {
    username: "Gagandeep Singh",
    initials: "GS",
    id: 2,
    email: "gagan@thevetted.com",
    phone: "+91 9123456789",
    rating: 5,
    relatedWorkflow: 1,
    company: "Mckinsey"
  },
  {
    username: "Palak Arbol",
    initials: "PA",
    id: 3,
    email: "Palak@thevetted.com",
    phone: "+91 9123456789",
    rating: 4,
    relatedWorkflow: 3,
    company: "Intuit"
  },
  {
    username: "Tajinder Singh",
    initials: "TS",
    id: 4,
    email: "taj@thevetted.com",
    phone: "+91 9123456789",
    rating: 3,
    relatedWorkflow: 5,
    company: "Dun & Bradstreet"
  },
  {
    username: "Jagmeet Lamba",
    initials: "JL",
    id: 5,
    email: "jlamba@thevetted.com",
    phone: "+91 9123456789",
    rating: 3,
    relatedWorkflow: 9,
    company: "DowJones"
  }
];

export default (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USER_SUCCESSFUL":
      return Object.assign({}, state, {
        users: usersList,
        usersFetched: true
      });
    case "FETCH_USER_FAILED":
      return Object.assign({}, state, {
        users: {},
        usersFetched: false,
        userFetchError: true
      });
    default:
      return state;
  }
};
