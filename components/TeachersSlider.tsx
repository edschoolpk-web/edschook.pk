"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Teacher {
    id: string;
    slug: string;
    name: string;
    role: string | null;
    image: string | null;
    socials?: {
        facebook?: string | null;
        twitter?: string | null;
        linkedin?: string | null;
        instagram?: string | null;
    } | null;
}

interface TeachersSliderProps {
    teachers: Teacher[];
}

export default function TeachersSlider({ teachers }: TeachersSliderProps) {
    const NextArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#135e9e",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    zIndex: 2,
                    right: "-10px"
                }}
                onClick={onClick}
            >
                <i className="fas fa-chevron-right" style={{ color: "white" }}></i>
            </div>
        );
    };

    const PrevArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#135e9e",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    zIndex: 2,
                    left: "-10px"
                }}
                onClick={onClick}
            >
                <i className="fas fa-chevron-left" style={{ color: "white" }}></i>
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false, // Often better to hide arrows on mobile
                    dots: true // And show dots instead
                }
            }
        ]
    };

    return (
        <div className="teachers-slider-container pb-10 px-4">
            <Slider {...settings}>
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="px-2"> {/* Added padding for gap effect */}
                        <div className="teacher">
                            <div className="teacher-img">
                                <Image
                                    src={teacher.image || '/webImages/tech1.jpg'}
                                    alt={teacher.name}
                                    width={300}
                                    height={405}
                                    className="w-100"
                                    style={{ height: '405px', objectFit: 'cover' }}
                                />
                                <div className="sc-div">
                                    <ul>
                                        {teacher.socials?.instagram && <li><a href={teacher.socials.instagram}><i className="fab fa-instagram"></i></a></li>}
                                        {teacher.socials?.linkedin && <li><a href={teacher.socials.linkedin}><i className="fab fa-linkedin-in"></i></a></li>}
                                        {teacher.socials?.facebook && <li><a href={teacher.socials.facebook}><i className="fab fa-facebook-f"></i></a></li>}
                                        {teacher.socials?.twitter && <li><a href={teacher.socials.twitter}><i className="fab fa-twitter"></i></a></li>}
                                    </ul>
                                    <span><Image src="/webImages/plus.png" alt="plus" width={20} height={20} /></span>
                                </div>
                            </div>
                            <div className="teacher-info p-3">
                                <h3>
                                    <Link href={`/teachers/${teacher.slug}`} title={teacher.name}>
                                        {teacher.name}
                                    </Link>
                                </h3>
                                <span>{teacher.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
