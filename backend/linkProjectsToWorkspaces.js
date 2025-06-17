import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const workspaceSchema = new mongoose.Schema({
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
}, { strict: false }); // allow other fields too

const projectSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
}, { strict: false });

const Workspace = mongoose.model("Workspace", workspaceSchema, "workspaces");
const Project = mongoose.model("Project", projectSchema, "projects");

async function linkProjectsToWorkspaces() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const projects = await Project.find({});

    console.log(`Found ${projects.length} projects.`);

    for (const project of projects) {
      if (!project.workspace) {
        console.log(`Project ${project._id} has no workspace assigned. Skipping.`);
        continue;
      }

      // Find the workspace and update its projects array (add if not exists)
      await Workspace.updateOne(
        { _id: project.workspace, projects: { $ne: project._id } }, // only update if project._id not in projects array
        { $push: { projects: project._id } }
      );

      console.log(`Linked project ${project._id} to workspace ${project.workspace}`);
    }

    console.log("Done linking projects to workspaces.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    mongoose.disconnect();
  }
}

linkProjectsToWorkspaces();
