import bcrypt from "bcrypt";
import { Request, Response } from "express";
import db from "../../../db/knexKonfig";
import { generateToken } from "../../../utils/token.utils";
import { DELETED, UPDATED } from "../../../middleware/error.middleware";
import sgMail from "@sendgrid/mail";

export async function registration(req: Request, res: Response) {
  const { userName, email, password, isVerified } = req.query;

  if (typeof email !== "string") {
    res.status(400).send("Invalid email address");
    return;
  }

  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(7));

  const userToDB = {
    is_verified: isVerified,
    is_admin: false,
    user_name: userName,
    email,
    password: hash,
    purchased_courses_id: [],
    favourite_courses_id: [],
    comleted_lessons_id: [],
  };

  const existingUser = await db("users").where("email", email).first();

  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }

  const newUser = await db("users").insert(userToDB).returning("*");
  console.log(newUser);

  const token = generateToken(newUser[0].id);
  console.log("token-registration", token);

  const userId = await db
    .select("id")
    .from("users")
    .where("email", email)
    .first();

  const verifyLink = `https://its-easy-platform.vercel.app/login/verify/${userId.id}/`;

  const msg = {
    to: email,
    from: "voronyuk.an@gmail.com",
    subject: "Verify your account",
    text: `You signed up on Its's easy platform. \n Please go to the following link to verify your account:${verifyLink}\n`,
  };

  try {
    await sgMail.send(msg);

    return res
      .status(201)
      .json({ token, user: newUser[0].id, message: "Verification email sent" });
  } catch (error) {
    res.status(500).send("Failed to send email and error in users.controller");
  }
}

export async function login(req, res) {
  const { email, password } = req.query;

  try {
    const user = await db.select().from("users").where("email", "=", email);
    if (!user[0]) {
      return res
        .status(401)
        .json({ message: "The email you entered does not exist!" });
    }

    const isVerified = user[0].is_verified;
    if (!isVerified) {
      return res.status(401).json({ message: "Please verify your account!" });
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
      return res
        .status(401)
        .json({ message: "The password you provided is incorrect!" });
    }
    const token = generateToken(user[0].id);
    console.log("token-login ", token);
    return res.status(200).json({ token, user: user[0] });
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(400).json({ message: error });
  }
}

export async function requestResetPassword(req: Request, res: Response) {
  const { email } = req.query;

  if (typeof email !== "string") {
    res.status(400).send("Invalid email address");
    return;
  }

  try {
    const userId = await db
      .select("id")
      .from("users")
      .where("email", email)
      .first();

    if (userId) {
      const resetLink = `https://its-easy-platform.vercel.app/login/reset-password/${userId.id}/`;

      const msg = {
        to: email,
        from: "voronyuk.an@gmail.com",
        subject: "Password Reset",
        text: `You requested a password reset. Please go to the following link to reset your password:${resetLink}\n`,
      };

      try {
        await sgMail.send(msg);
        res.status(200).send("Password reset email sent");
      } catch (error) {
        res.status(500).send("Failed to send email");
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function changePassword(req: Request, res: Response) {
  const { id, password } = req.query;

  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(7));

  try {
    await db
      .table("users")
      .update({
        password: hash,
      })
      .where("id", id);

    return res.status(200).json({ message: UPDATED });
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const getUsers = await db.select("*").from("users");

    return res.status(200).json({ getUsers });
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await db.select("*").from("users").where("id", id).first();

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id, isVerified, isAdmin } = req.query;
  const data = req.body;

  console.log(data);

  try {
    await db
      .table("users")
      .update({
        is_verified: isVerified,
        is_admin: isAdmin,
        purchased_courses_id: JSON.stringify(data.purchasedCoursesId),
        favourite_courses_id: JSON.stringify(data.favouriteCoursesId),
        comleted_lessons_id: JSON.stringify(data.comletedLessonsId),
      })
      .where("id", id);

    return res.status(200).json({ message: "UPDATED" });
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.query;

  try {
    await db("users").where({ id }).del();

    return res.status(200).json({ message: DELETED });
  } catch (error) {
    console.error("Error in users.controller.ts", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
