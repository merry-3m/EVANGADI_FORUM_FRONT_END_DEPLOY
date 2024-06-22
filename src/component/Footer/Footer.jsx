import React from "react";
import classes from "./footer.module.css";
import evanLogo from "../../assets/images/evangadi-logo-footer.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <section className={classes.footer_section}>
      <div className={classes.footer_container}>
        {/* logo and social media */}
        <div className={classes.logo_media_container}>
          {/* logo */}
          <div className={classes.logo}>
            <Link to="/">
              <img src={evanLogo} alt="Evangadi Logo" />
            </Link>
          </div>
          {/* media */}
          <div className={classes.social_media}>
            <Link
              to="https://www.facebook.com/Evangadi-107311119466550/"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fa-brands fa-facebook"></i>
            </Link>
            <Link
              to="https://www.instagram.com/evangadi_official/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </Link>
            <Link
              to="https://www.youtube.com/@EvangadiTech"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fa-brands fa-youtube"></i>
            </Link>
          </div>
        </div>

        {/* useful link */}
        <div className={classes.useful_link_container}>
          <h5>Useful Link</h5>
          <ul>
            <li>
              {" "}
              <Link>How it works</Link>
            </li>
            <li>
              <Link>Terms of Service</Link>
            </li>
            <li>
              <Link>Privacy Policy</Link>
            </li>
          </ul>
        </div>
        {/* contact info */}
        <div className={classes.contact_info_container}>
          <h5>Contact Info</h5>
          <ul>
            <li>
              <Link>Evangadi Networks</Link>
            </li>
            <li>support@evangadi.com</li>
            <li>+1-202-386-2702</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Footer;
