using AutoMapper;

namespace prid2122_g03.Models
{
    /*
    Cette classe sert à configurer AutoMapper pour lui indiquer quels sont les mappings possibles
    et, le cas échéant, paramétrer ces mappings de manière déclarative (nous verrons des exemples plus tard).
    */
    public class MappingProfile : Profile
    {
        private CvContext _context;

        /*
        Le gestionnaire de dépendance injecte une instance du contexte EF dont le mapper peut
        se servir en cas de besoin (ce n'est pas encore le cas).
        */
        public MappingProfile(CvContext context) {
            _context = context;

            CreateMap<Member, MemberDTO>();
            CreateMap<MemberDTO, Member>();

            CreateMap<Member, MemberWithPasswordDTO>();
            CreateMap<MemberWithPasswordDTO, Member>();

            CreateMap<Phone, PhoneDTO>();
            CreateMap<PhoneDTO, Phone>();


            //ajout classes du projet prid2121-g03:
            CreateMap<Mission, MissionDTO>();
            CreateMap<MissionDTO, Mission>();

            // CreateMap<Experience, ExperienceDTO>();
            // CreateMap<ExperienceDTO, Experience>();

            CreateMap<Enterprise, EnterpriseDTO>();
            CreateMap<EnterpriseDTO, Enterprise>();

            CreateMap<Consultant, UserDTO>();
            CreateMap<UserDTO, Consultant>();

            CreateMap<Consultant, UserWithPasswordDTO>();
            CreateMap<UserWithPasswordDTO, Consultant>();

            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();

            CreateMap<User, UserWithPasswordDTO>();
            CreateMap<UserWithPasswordDTO, User>();

            CreateMap<User, UserWithExperiencesDTO>();
            CreateMap<UserWithExperiencesDTO, User>();

            CreateMap<User, UserWithMasteringsDTO>();
            CreateMap<UserWithMasteringsDTO, User>();

            CreateMap<User, UserWithExperiencesWithMasteringsDTO>();
            CreateMap<UserWithExperiencesWithMasteringsDTO, User>();

            // CreateMap<Consultant, ConsultantDTO>();
            // CreateMap<ConsultantDTO, Consultant>();

            // CreateMap<Manager, ManagerDTO>();
            // CreateMap<ManagerDTO, Manager>();

            CreateMap<Manager, ManagerWithConsultantsDTO>();
            CreateMap<ManagerWithConsultantsDTO, Manager>();

            CreateMap<Manager, ManagerWithExperiencesWithMasteringsWithConsultantsDTO>();
            CreateMap<ManagerWithExperiencesWithMasteringsWithConsultantsDTO, Manager>();


            CreateMap<Mastering, MasteringDTO>();
            CreateMap<MasteringDTO, Mastering>();

            CreateMap<Mastering, MasteringWithSkillDTO>();
            CreateMap<MasteringWithSkillDTO, Mastering>();

            CreateMap<Skill, SkillDTO>();
            CreateMap<SkillDTO, Skill>();

            CreateMap<Skill, SkillWithMasteringsDTO>();
            CreateMap<SkillWithMasteringsDTO, Skill>();

            CreateMap<Skill, SkillWithCategoryDTO>();
            CreateMap<SkillWithCategoryDTO, Skill>();

            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();

            CreateMap<Category, CategoryWithSkillsDTO>();
            CreateMap<CategoryWithSkillsDTO, Category>();


        }
    }
}
