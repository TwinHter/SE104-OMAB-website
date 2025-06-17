// src/components/layout/Footer.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
    faFacebook,
    faTwitter,
    faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-primary-dark to-primary text-white py-10 mt-12 font-pt-sans">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-primary-light pb-2">
                        Về chúng tôi
                    </h3>
                    <p className="text-sm leading-relaxed">
                        Hệ thống quản lý phòng khám của chúng tôi cam kết mang
                        đến dịch vụ chăm sóc sức khỏe tốt nhất với công nghệ
                        hiện đại và đội ngũ y bác sĩ tận tâm.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-primary-light pb-2">
                        Liên kết nhanh
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="text-sm hover:text-accent transition duration-300"
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/doctors"
                                className="text-sm hover:text-accent transition duration-300"
                            >
                                Tìm bác sĩ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact-admin"
                                className="text-sm hover:text-accent transition duration-300"
                            >
                                Liên hệ Admin
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-primary-light pb-2">
                        Liên hệ
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="mr-3 text-accent"
                            />
                            Thu Duc, Ho Chi Minh, Viet Nam
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="mr-3 text-accent"
                            />
                            +84 987 654 321
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-primary-light pb-2">
                        Mạng xã hội
                    </h3>
                    <div className="flex space-x-4 text-2xl">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition duration-300"
                        >
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition duration-300"
                        >
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition duration-300"
                        >
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
