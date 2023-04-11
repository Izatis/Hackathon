import React, { Suspense, useContext, useState } from "react";
import s from "./SignUp.module.scss";
import email from "../../assets/email.png";
import password from "../../assets/password.png";
import MyInput from "../../components/MUI/MyInput/MyInput";
import MyButton from "../../components/MUI/MyButton/MyButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import eye from "../../assets/eye.png";
import { exampleContext } from "../../context";
import wallpaper from "../../assets/wallpaper.png";
import { motion } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model } from '../../models/Car';



const SignUp = () => {
 // Функция - для смены текста
 const { t } = useContext(exampleContext);

  // Здесь сохраняется сообщение от сервера
  const [message, setMessage] = useState("");

  //   Здесь я достаю состояние загрузки, с помощи хука useContext()
  const { isLoading, setIsLoading } = useContext(exampleContext);

  // Это состояние скрытие пароля
  const { type, passwordHide } = useContext(exampleContext);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  //   Отправляем post запрос и за одно проверяется пользователь и перенапраляется на профиль
  const verifyUser = async () => {
    setIsLoading(false);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/login",
        userData
      );
      localStorage.setItem("token", JSON.stringify(data.token));
      const token = JSON.parse(localStorage.getItem("token"));
      const loginOpen = () => {
        if (!!token) {
          navigate("/");
        }
      };
      loginOpen();
      setIsLoading(true);
    } catch (error) {
      setMessage(error.response.data.error);
    }
    setIsLoading(true);
  };

  return (
    <section className={s.sign_up}>
     
<motion.div 
initial="hidden"
whileInView="visible"
transition={{ duration: 1 }}
variants={{
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 100 },
}} className={s.animation}>
  <motion.h1 
   initial="hidden"
  whileInView="visible"
  transition={{ duration: 1 }}
  variants={{
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 100 },
  }}
  className={s.animation_text}>{t("general.2")}</motion.h1>
<Canvas camera={{position: [2, 0, -4], zoom: 1}}>
      <OrbitControls/>
        <color attach="background" />
        <hemisphereLight intensity={0.35}/>
        <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow

        />
      <Suspense fallback={null}>
        <Model/>
      </Suspense>
      </Canvas>
</motion.div>

      {isLoading ? (
        <div className={s.sign_up_content}>
          <motion.h1 initial="hidden"
          whileInView="visible"
          transition={{ duration: 1 }}
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: 100 },
          }}>{t("form.0")}</motion.h1>
          <form className={s.sign_up_inputs_btn}>
            <MyInput
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              type="name"
              placeholder={t("form.2")}
            ></MyInput>
            <MyInput
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              type="email"
              placeholder={t("form.3")}
            ></MyInput>

            <MyInput
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              type={type}
              placeholder={t("form.4")}
            >
              <span className={s.sign_up_hide_password} onClick={passwordHide}>
                <img src={eye} alt="eye" />
              </span>
            </MyInput>
            {/* Здесь проверяется присутствие сообщении от сервера */}
            {!!message.length && <span className={s.sign_up_message}>{message}</span>}

            {/* Это сравнение проверяет на содержания инпутов и изменяет кнопки */}
            {!!userData.email.length && !!userData.password.length && !!userData.name.length ? (
              <MyButton className={s.redister} onClick={verifyUser}>
                {t("form.5")}
              </MyButton>
            ) : (
              <MyButton className={s.redister} disabled>
                  {t("form.5")}
              </MyButton>
            )}
          </form>
        </div>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default SignUp;
