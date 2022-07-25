using System;
using ProtoBuf;

namespace CharacterRecordsGenerator
{
    [ProtoContract]
    public class Record
    {
        // Defaults defined here will automatically populate the form on program load
        [ProtoMember(1)]
        public string FirstName { get; set; } = string.Empty;

        [ProtoMember(2)]
        public string MiddleName { get; set; } = string.Empty;

        [ProtoMember(3)]
        public string LastName { get; set; } = string.Empty;

        [ProtoMember(4)]
        public string SpokenLanguages { get; set; } = string.Empty;

        [ProtoMember(5)]
        public SpeciesType Species { get; set; } = SpeciesType.Human;


        [ProtoMember(6)]
        public string Pronouns { get; set; } = string.Empty;

        [ProtoMember(7)]
        public DateTime BirthDate { get; set; } = Info.IcDate;

        [ProtoMember(8)]
        public double? CharHeight { get; set; } = null;

        [ProtoMember(9)]
        public double? Weight { get; set; } = null;

        [ProtoMember(10)]
        public string SkinColor { get; set; } = string.Empty;

        [ProtoMember(11)]
        public string EyeColor { get; set; } = string.Empty;

        [ProtoMember(12)]
        public string DistinguishingFeatures { get; set; } = string.Empty;

        [ProtoMember(13)]
        public string HairColor { get; set; } = string.Empty;

        [ProtoMember(14)]
        public string EmployedAs { get; set; } = string.Empty;

        [ProtoMember(15)]
        public string Citizenship { get; set; } = string.Empty;

        [ProtoMember(16)]
        public SpeciesSubType Subspecies { get; set; } = SpeciesSubType.None;

        [ProtoMember(17)]
        public string PublicNotes { get; set; } = string.Empty;

        [ProtoMember(18)]
        public string NextOfKin { get; set; } = string.Empty;

        // 19 was used for MedicalPublicRecord, now empty

        [ProtoMember(20)]
        public string MedicalHistory { get; set; } = string.Empty;

        [ProtoMember(21)]
        public string MedicalNotes { get; set; } = string.Empty;

        [ProtoMember(22)]
        public string MedicalPsychHistory { get; set; } = string.Empty;

        [ProtoMember(23)]
        public string MedicalPsychNotes { get; set; } = string.Empty;

        [ProtoMember(24)]
        public bool NoBorg { get; set; } = false;

        // 25 was NoClone, now unused

        [ProtoMember(26)]
        public bool NoRevive { get; set; } = false;

        [ProtoMember(27)]
        public bool NoProsthetic { get; set; } = false;

        [ProtoMember(28)]
        public string MedicalPrescriptions { get; set; } = string.Empty;

        // 29 was used for SecurityPublicRecord, now empty

        [ProtoMember(30)]
        public string SecurityRecords { get; set; } = string.Empty;

        [ProtoMember(31)]
        public string SecurityNotes { get; set; } = string.Empty;

        // 32 was used for EmploymentPublicRecord, now empty

        [ProtoMember(33)]
        public string EmploymentExperience { get; set; } = string.Empty;

        [ProtoMember(35)]
        public string EmploymentFormalEducation { get; set; } = string.Empty;

        [ProtoMember(36)]
        public string EmploymentNtEmploymentHistory { get; set; } = string.Empty;

        [ProtoMember(37)]
        public string EmploymentSkills { get; set; } = string.Empty;

        [ProtoMember(38)]
        public string SecurityAttitudeScc { get; set; } = string.Empty;

        [ProtoMember(39)]
        public string SecurityAttitudeCrew { get; set; } = string.Empty;
    }
}