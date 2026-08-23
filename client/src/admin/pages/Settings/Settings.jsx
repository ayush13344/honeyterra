import {
  Store,
  Truck,
  Lock,
  Save,
} from "lucide-react";

import { useState } from "react";

import "./Settings.css";

function Settings() {
  const [storeData, setStoreData] = useState({
    storeName: "HoneyTerra",
    email: "support@honeyterra.com",
    phone: "",
    address: "",
    freeShipping: "999",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStoreData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    /*
      Later:

      PUT /api/admin/settings

      For now we only show
      the saved state.
    */

    setSaved(true);
  };

  return (
    <div className="admin-settings-page">

      <div className="admin-page-heading">

        <div>
          <span className="admin-page-eyebrow">
            CONFIGURATION
          </span>

          <h1>Settings</h1>

          <p>
            Manage your store and admin preferences.
          </p>
        </div>

      </div>

      <form
        className="settings-form"
        onSubmit={handleSave}
      >

        {/* Store */}

        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon">
              <Store size={20} />
            </div>

            <div>
              <h2>Store Information</h2>
              <p>
                Basic information about your HoneyTerra store.
              </p>
            </div>

          </div>

          <div className="settings-grid">

            <div className="settings-field">

              <label htmlFor="storeName">
                Store Name
              </label>

              <input
                id="storeName"
                name="storeName"
                value={storeData.storeName}
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="email">
                Store Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={storeData.email}
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="phone">
                Contact Number
              </label>

              <input
                id="phone"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={storeData.phone}
                onChange={handleChange}
              />

            </div>

            <div className="settings-field">

              <label htmlFor="address">
                Store Address
              </label>

              <input
                id="address"
                name="address"
                placeholder="Enter store address"
                value={storeData.address}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* Shipping */}

        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon">
              <Truck size={20} />
            </div>

            <div>
              <h2>Shipping</h2>
              <p>
                Configure basic shipping settings.
              </p>
            </div>

          </div>

          <div className="settings-grid">

            <div className="settings-field">

              <label htmlFor="freeShipping">
                Free Shipping Above
              </label>

              <div className="settings-input-prefix">

                <span>₹</span>

                <input
                  id="freeShipping"
                  name="freeShipping"
                  type="number"
                  value={storeData.freeShipping}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* Security */}

        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon">
              <Lock size={20} />
            </div>

            <div>
              <h2>Admin Security</h2>
              <p>
                Manage your administrator account.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="change-password-button"
          >
            Change Password
          </button>

        </section>

        {/* Save */}

        <div className="settings-save-row">

          {saved && (
            <span className="settings-saved">
              Changes saved successfully.
            </span>
          )}

          <button
            type="submit"
            className="settings-save-button"
          >
            <Save size={17} />
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
}

export default Settings;