const data = [
  {
    id: 8661,
    uid: "fQcjGKKuVwVVwUgYRPXFBP",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/media/cache/9c/f4/9cf428908b4aa1a9edc501f68dd88e32.jpg",
      id: 2597,
      name: "Lenovo Group",
      uid: "sHwD549oZRFAWni8StWEAb"
    },
    end_date: null,
    amount: null,
    name: "LENOVO GROUP",
    created: "2018-02-21T14:18:47.468115Z",
    last_activity: "2018-02-21T15:52:59.655812Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/palak2/",
      email: "palak@thevetted.com",
      id: 124,
      avatar: null,
      name: "palak abrol"
    },
    sponsors: [],
    supplier_contacts: [
      {
        profile: "/users/suprama+test678/",
        email: "suprama+test678@thevetted.com",
        id: 138,
        avatar: null,
        name: "suprama+test678@thevetted.com"
      }
    ],
    person: null,
    object_id: 2597,
    entity_id: null,
    increment: 6426,
    increment_id: 256426,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124, 138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-21T15:52:59.650879Z",
          approvers: [],
          item_id: 8661,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: true
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 67,
        name: "Review TAX ID",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 67,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 13,
          label: "GFA Review",
          score: 0,
          id: 13
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124, 135, 138, 140],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113, 138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 8661,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 8661,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 8661,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 8661,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 8661,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 4121,
    uid: "Lx2Lwos3aYuNEpWMhGtEj8",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/static/images/defaults/placeholder-co.png",
      id: 574,
      name: "SWAJ KRUBB AND KAFE",
      uid: "EnuGDfN3jdiuGEq4F3bTva"
    },
    end_date: null,
    amount: null,
    name: "SWAJ KRUBB AND KAFE",
    created: "2018-02-16T15:20:37.129920Z",
    last_activity: "2018-02-21T10:14:01.270318Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/palak2/",
      email: "palak@thevetted.com",
      id: 124,
      avatar: null,
      name: "palak abrol"
    },
    sponsors: [],
    supplier_contacts: [
      {
        profile: "/users/andrew/",
        email: "andrew_herz@mckinsey.com",
        id: 89,
        avatar: null,
        name: "Andrew Herz"
      }
    ],
    person: null,
    object_id: 574,
    entity_id: null,
    increment: 1922,
    increment_id: 251922,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: true,
          users: [89, 124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 4121,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [89],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-21T10:14:01.266728Z",
          approvers: [],
          item_id: 4121,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 4121,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: true,
          users: [89, 124, 135, 140],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 4121,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 4121,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4121,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4121,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4121,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4121,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4121,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4121,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4121,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4121,
          value: 13,
          label: "GFA Review",
          score: 0,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 4116,
    uid: "EY3VEHVThKsUMph8d8YPDb",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/static/images/defaults/placeholder-co.png",
      id: 574,
      name: "SWAJ KRUBB AND KAFE",
      uid: "EnuGDfN3jdiuGEq4F3bTva"
    },
    end_date: null,
    amount: null,
    name: "SWAJ KRUBB AND KAFE",
    created: "2018-02-16T15:19:16.653385Z",
    last_activity: "2018-02-16T15:19:27.121776Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/palak2/",
      email: "palak@thevetted.com",
      id: 124,
      avatar: null,
      name: "palak abrol"
    },
    sponsors: [],
    supplier_contacts: [
      {
        profile: "/users/andrew/",
        email: "andrew_herz@mckinsey.com",
        id: 89,
        avatar: null,
        name: "Andrew Herz"
      }
    ],
    person: null,
    object_id: 574,
    entity_id: null,
    increment: 1917,
    increment_id: 251917,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [89, 124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [89],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [89, 124, 135],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4116,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-16T15:19:27.118706Z",
          approvers: [],
          item_id: 4116,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4116,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 4116,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 4116,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 4116,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "",
          lc: 4116,
          value: 13,
          label: "GFA Review",
          score: null,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 3630,
    uid: "NhXTNXuZbrp8v9Pm3bMiVS",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/media/cache/9c/f4/9cf428908b4aa1a9edc501f68dd88e32.jpg",
      id: 2597,
      name: "Lenovo Group",
      uid: "sHwD549oZRFAWni8StWEAb"
    },
    end_date: null,
    amount: null,
    name: "Lenovo Group",
    created: "2018-02-15T06:49:53.126200Z",
    last_activity: "2018-02-21T14:25:38.659519Z",
    score: "102.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/palak2/",
      email: "palak@thevetted.com",
      id: 124,
      avatar: null,
      name: "palak abrol"
    },
    sponsors: [],
    supplier_contacts: [
      {
        profile: "/users/suprama+test678/",
        email: "suprama+test678@thevetted.com",
        id: 138,
        avatar: null,
        name: "suprama+test678@thevetted.com"
      }
    ],
    person: null,
    object_id: 2597,
    entity_id: null,
    increment: 1432,
    increment_id: 251432,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: true,
          users: [124, 138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3630,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-21T14:25:38.655687Z",
          approvers: [],
          item_id: 3630,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3630,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: true,
          users: [124, 135, 138, 140],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3630,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113, 138],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3630,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3630,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-15T21:06:25.294086Z",
          approvers: [],
          item_id: 3630,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3630,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3630,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 77,
        name: "Hoovers Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 77,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 73,
        name: "Adverse Media",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 73,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 12,
        name: "Social Media",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-16T06:22:36.458641Z",
          approvers: [],
          item_id: 3630,
          step_id: 12,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 14,
        name: "Website",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-15T10:55:17.578157Z",
          approvers: [],
          item_id: 3630,
          step_id: 14,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 81,
        name: "Vetting Questionnaire",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 81,
          score: 102,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 71,
        name: "Risk Score",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 71,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 17,
          label: "L2: Legitimacy",
          score: 102,
          id: 17
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3630,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: true
        },
        group: {
          status: "incomplete",
          lc: 3630,
          value: 13,
          label: "GFA Review",
          score: 0,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 3627,
    uid: "hDrGy3dehcpMFyDMbmynuf",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/static/images/defaults/placeholder-co.png",
      id: 2596,
      name: "ENDERS ANALYSIS LIMITED",
      uid: "ujxcqQXnqTBpDuTshKDcM7"
    },
    end_date: null,
    amount: null,
    name: "ENDERS ANALYSIS LIMITED",
    created: "2018-02-14T10:04:00.707535Z",
    last_activity: "2018-02-14T10:06:14.105635Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/mahesh/",
      email: "mahesh_matta@mckinsey.com",
      id: 24,
      avatar: null,
      name: "Mahesh Matta"
    },
    sponsors: [],
    supplier_contacts: [],
    person: null,
    object_id: 2596,
    entity_id: null,
    increment: 1430,
    increment_id: 251430,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "red_flag",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 65,
          score: 0,
          error_flag_message:
            'as value of Entity name is "---" which is not equals to "ENDERS ANALYSIS LIMITED" (Business / supplier name)',
          should_raise_error: true
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24, 135],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3627,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-14T10:04:20.677611Z",
          approvers: [],
          item_id: 3627,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3627,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3627,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3627,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3627,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "",
          lc: 3627,
          value: 13,
          label: "GFA Review",
          score: null,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 3626,
    uid: "mh947aphmKyAaVnJ7L9hQc",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/static/images/defaults/placeholder-co.png",
      id: 2595,
      name: "example.com",
      uid: "HqXLRxFJD5kG6wgXZFgvrT"
    },
    end_date: null,
    amount: null,
    name: "BLU KLEANING SERVICES INC",
    created: "2018-02-14T10:03:02.306053Z",
    last_activity: "2018-02-14T10:03:02.306085Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/mahesh/",
      email: "mahesh_matta@mckinsey.com",
      id: 24,
      avatar: null,
      name: "Mahesh Matta"
    },
    sponsors: [],
    supplier_contacts: [],
    person: null,
    object_id: 2595,
    entity_id: null,
    increment: 1429,
    increment_id: 251429,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [135],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3626,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3626,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3626,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3626,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3626,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "",
          lc: 3626,
          value: 13,
          label: "GFA Review",
          score: null,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 3625,
    uid: "H7DK8GbhtTKnbJ3ZAFmUzB",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/static/images/defaults/placeholder-co.png",
      id: 2595,
      name: "example.com",
      uid: "HqXLRxFJD5kG6wgXZFgvrT"
    },
    end_date: null,
    amount: null,
    name: "Vodafone Limited",
    created: "2018-02-14T08:05:59.269982Z",
    last_activity: "2018-02-14T09:48:40.819988Z",
    score: "0.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/mahesh/",
      email: "mahesh_matta@mckinsey.com",
      id: 24,
      avatar: null,
      name: "Mahesh Matta"
    },
    sponsors: [],
    supplier_contacts: [],
    person: null,
    object_id: 2595,
    entity_id: null,
    increment: 1428,
    increment_id: 251428,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: true
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24, 135],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 75,
        name: "Banking Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 75,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: true,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3625,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-14T08:16:23.102382Z",
          approvers: [],
          item_id: 3625,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3625,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "locked",
          lc: 3625,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3625,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [24],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3625,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "",
          lc: 3625,
          value: 13,
          label: "GFA Review",
          score: null,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  },
  {
    id: 3624,
    uid: "2XkhqBWq85SwJ6JzXFUdHQ",
    lifecycle: {
      show_id: true,
      name: "Add a supplier or site",
      kind: 1,
      site_enabled: true,
      is_secondary: false,
      id: 1,
      icon: ""
    },
    status: {
      color: "primary",
      kind: 2,
      icon: "",
      id: 4,
      label: "In progress"
    },
    item: {
      logo: "/media/cache/9d/1c/9d1c0574b30d153bd91b158ccb9fc7d6.jpg",
      id: 2594,
      name: "TOSHIBA",
      uid: "Ck6L3YtZe2wbiszkKYbqUW"
    },
    end_date: null,
    amount: null,
    name: "TOSHIBA",
    created: "2018-02-12T13:48:42.118383Z",
    last_activity: "2018-02-21T14:03:40.882037Z",
    score: "36.0",
    message_count: {
      count: "0"
    },
    on_hold: false,
    silent_onboarding: true,
    created_by: {
      profile: "/users/palak2/",
      email: "palak@thevetted.com",
      id: 124,
      avatar: null,
      name: "palak abrol"
    },
    sponsors: [],
    supplier_contacts: [],
    person: null,
    object_id: 2594,
    entity_id: null,
    increment: 1427,
    increment_id: 251427,
    divisions: null,
    notes: [],
    content_type: 85,
    steps: [
      {
        id: 2,
        name: "Basic Infomation",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-21T12:09:37.307281Z",
          approvers: [],
          item_id: 3624,
          step_id: 2,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3624,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 65,
        name: "TAX ID CHECK",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-21T14:03:40.878146Z",
          approvers: [],
          item_id: 3624,
          step_id: 65,
          score: 0,
          error_flag_message: "",
          should_raise_error: true
        },
        group: {
          status: "overdue",
          lc: 3624,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 67,
        name: "Review TAX ID",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 67,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 13,
          label: "GFA Review",
          score: 0,
          id: 13
        }
      },
      {
        id: 23,
        name: "Billing Information",
        status: {
          is_enabled: true,
          is_overdue: true,
          users: [124, 135, 140],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 23,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3624,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 25,
        name: "Ordering Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 25,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3624,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 75,
        name: "Banking Information",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 75,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "overdue",
          lc: 3624,
          value: 15,
          label: "Supplier Info",
          score: 0,
          id: 15
        }
      },
      {
        id: 1,
        name: "Set Up",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 1,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 21,
          label: "SETUP",
          score: 0,
          id: 21
        }
      },
      {
        id: 11,
        name: "Sanctions and Watch list",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 11,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 69,
        name: "World Bank",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 69,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 76,
        name: "Country Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 76,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 16,
          label: "L1: Basic",
          score: 0,
          id: 16
        }
      },
      {
        id: 77,
        name: "Hoovers Risk Level",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 77,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 73,
        name: "Adverse Media",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 73,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 12,
        name: "Social Media",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-13T16:48:17.151893Z",
          approvers: [],
          item_id: 3624,
          step_id: 12,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 14,
        name: "Website",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [37, 38, 39, 89, 111, 112, 113],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: "2018-02-12T14:10:10.623129Z",
          approvers: [],
          item_id: 3624,
          step_id: 14,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 81,
        name: "Vetting Questionnaire",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 81,
          score: 36,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 71,
        name: "Risk Score",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 71,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 17,
          label: "L2: Legitimacy",
          score: 36,
          id: 17
        }
      },
      {
        id: 27,
        name: "Misc (GFA)",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 27,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 79,
        name: "Review",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 79,
          score: 0,
          error_flag_message: "",
          should_raise_error: false
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 22,
          label: "Review",
          score: 0,
          id: 22
        }
      },
      {
        id: 80,
        name: "Duplicate check",
        status: {
          is_enabled: true,
          is_overdue: false,
          users: [124],
          is_locked: false,
          needs_approval: false,
          error_flag: "",
          completed_at: null,
          approvers: [],
          item_id: 3624,
          step_id: 80,
          score: 0,
          error_flag_message: "",
          should_raise_error: true
        },
        group: {
          status: "incomplete",
          lc: 3624,
          value: 13,
          label: "GFA Review",
          score: 0,
          id: 13
        }
      }
    ],
    new_site: false,
    site_name: ""
  }
];

export default data;
