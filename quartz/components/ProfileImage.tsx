import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
    function ProfileImage({ displayClass }: QuartzComponentProps) {
        return (
            <div class={`profile-image-container ${displayClass ?? ""}`}>
                <img
                    src="/static/profile.png"
                    alt="프로필 사진"
                    class="profile-image"
                />
            </div>
        )
    }

    ProfileImage.css = `
    .profile-image-container {
      display: flex;
      justify-content: center;
      padding: 1rem 0 0.5rem 0;
    }

    .profile-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
  `

    return ProfileImage
}) satisfies QuartzComponentConstructor